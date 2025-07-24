const Category = require('../models/Category');

// Получить все категории
exports.getAllCategories = async (req, res) => {
  try {
    const { isActive = true } = req.query;
    const query = isActive !== 'all' ? { isActive: isActive === 'true' } : {};

    const categories = await Category.find(query).sort({ sortOrder: 1, name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении категорий', error: error.message });
  }
};

// Получить категорию по ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Категория не найдена' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении категории', error: error.message });
  }
};

// Создать новую категорию
exports.createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при создании категории', error: error.message });
  }
};

// Обновить категорию
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Категория не найдена' });
    }

    res.json(category);
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при обновлении категории', error: error.message });
  }
};

// Удалить категорию
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Категория не найдена' });
    }
    res.json({ message: 'Категория успешно удалена' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении категории', error: error.message });
  }
};