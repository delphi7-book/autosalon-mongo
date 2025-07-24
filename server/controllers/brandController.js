const Brand = require('../models/Brand');

// Получить все бренды
exports.getAllBrands = async (req, res) => {
  try {
    const { isActive = true } = req.query;
    const query = isActive !== 'all' ? { isActive: isActive === 'true' } : {};

    const brands = await Brand.find(query).sort({ name: 1 });
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении брендов', error: error.message });
  }
};

// Получить бренд по ID
exports.getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: 'Бренд не найден' });
    }
    res.json(brand);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении бренда', error: error.message });
  }
};

// Создать новый бренд
exports.createBrand = async (req, res) => {
  try {
    const brand = new Brand(req.body);
    await brand.save();
    res.status(201).json(brand);
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при создании бренда', error: error.message });
  }
};

// Обновить бренд
exports.updateBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!brand) {
      return res.status(404).json({ message: 'Бренд не найден' });
    }

    res.json(brand);
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при обновлении бренда', error: error.message });
  }
};

// Удалить бренд
exports.deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: 'Бренд не найден' });
    }
    res.json({ message: 'Бренд успешно удален' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении бренда', error: error.message });
  }
};