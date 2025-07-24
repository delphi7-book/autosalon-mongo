const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Получить всех пользователей
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, role, isActive } = req.query;
    const query = {};
    
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении пользователей', error: error.message });
  }
});

// Получить пользователя по ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении пользователя', error: error.message });
  }
});

// Создать нового пользователя
router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при создании пользователя', error: error.message });
  }
});

// Обновить пользователя
router.put('/:id', async (req, res) => {
  try {
    const updateData = { ...req.body };
    delete updateData.password; // Пароль обновляется отдельно

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при обновлении пользователя', error: error.message });
  }
});

// Удалить пользователя
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    res.json({ message: 'Пользователь успешно удален' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении пользователя', error: error.message });
  }
});

// Регистрация
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Проверяем, существует ли пользователь
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    const user = new User({ name, email, phone, password });
    await user.save();

    // Создаем JWT токен
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: 'Пользователь успешно зарегистрирован',
      token,
      user: userResponse
    });
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при регистрации', error: error.message });
  }
});

// Авторизация
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Находим пользователя
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    // Проверяем пароль
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    // Проверяем, активен ли пользователь
    if (!user.isActive) {
      return res.status(401).json({ message: 'Аккаунт заблокирован' });
    }

    // Обновляем время последнего входа
    user.lastLogin = new Date();
    await user.save();

    // Создаем JWT токен
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      message: 'Успешная авторизация',
      token,
      user: userResponse
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при авторизации', error: error.message });
  }
});

module.exports = router;