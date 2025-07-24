const Car = require('../models/Car');
const Brand = require('../models/Brand');
const Category = require('../models/Category');

// Получить все автомобили
exports.getAllCars = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      brand,
      category,
      minPrice,
      maxPrice,
      year,
      fuel,
      transmission,
      bodyType,
      condition,
      availability,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};

    // Фильтры
    if (brand) query.brand = brand;
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (year) query.year = Number(year);
    if (fuel) query.fuel = fuel;
    if (transmission) query.transmission = transmission;
    if (bodyType) query.bodyType = bodyType;
    if (condition) query.condition = condition;
    if (availability) query.availability = availability;

    // Поиск по тексту
    if (search) {
      query.$text = { $search: search };
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const cars = await Car.find(query)
      .populate('brand', 'name logo')
      .populate('category', 'name')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Car.countDocuments(query);

    res.json({
      cars,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении автомобилей', error: error.message });
  }
};

// Получить автомобиль по ID
exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id)
      .populate('brand', 'name logo description country')
      .populate('category', 'name description');

    if (!car) {
      return res.status(404).json({ message: 'Автомобиль не найден' });
    }

    // Увеличиваем счетчик просмотров
    car.views += 1;
    await car.save();

    res.json(car);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении автомобиля', error: error.message });
  }
};

// Создать новый автомобиль
exports.createCar = async (req, res) => {
  try {
    const car = new Car(req.body);
    await car.save();
    
    const populatedCar = await Car.findById(car._id)
      .populate('brand', 'name logo')
      .populate('category', 'name');

    res.status(201).json(populatedCar);
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при создании автомобиля', error: error.message });
  }
};

// Обновить автомобиль
exports.updateCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('brand', 'name logo')
      .populate('category', 'name');

    if (!car) {
      return res.status(404).json({ message: 'Автомобиль не найден' });
    }

    res.json(car);
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при обновлении автомобиля', error: error.message });
  }
};

// Удалить автомобиль
exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);

    if (!car) {
      return res.status(404).json({ message: 'Автомобиль не найден' });
    }

    res.json({ message: 'Автомобиль успешно удален' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении автомобиля', error: error.message });
  }
};

// Получить похожие автомобили
exports.getSimilarCars = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Автомобиль не найден' });
    }

    const similarCars = await Car.find({
      _id: { $ne: car._id },
      $or: [
        { brand: car.brand },
        { category: car.category },
        { bodyType: car.bodyType },
        { price: { $gte: car.price * 0.8, $lte: car.price * 1.2 } }
      ],
      availability: 'В наличии'
    })
      .populate('brand', 'name logo')
      .populate('category', 'name')
      .limit(6);

    res.json(similarCars);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении похожих автомобилей', error: error.message });
  }
};

// Получить популярные автомобили
exports.getPopularCars = async (req, res) => {
  try {
    const cars = await Car.find({ availability: 'В наличии' })
      .populate('brand', 'name logo')
      .populate('category', 'name')
      .sort({ views: -1 })
      .limit(10);

    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении популярных автомобилей', error: error.message });
  }
};