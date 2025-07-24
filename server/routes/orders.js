const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Получить все заказы
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type, user } = req.query;
    const query = {};
    
    if (status) query.status = status;
    if (type) query.type = type;
    if (user) query.user = user;

    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .populate('car', 'name brand model year price images')
      .populate('manager', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении заказов', error: error.message });
  }
});

// Получить заказ по ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone address')
      .populate('car', 'name brand model year price images specifications')
      .populate('manager', 'name email phone');

    if (!order) {
      return res.status(404).json({ message: 'Заказ не найден' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении заказа', error: error.message });
  }
});

// Создать новый заказ
router.post('/', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    
    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'name email phone')
      .populate('car', 'name brand model year price')
      .populate('manager', 'name email');

    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при создании заказа', error: error.message });
  }
});

// Обновить заказ
router.put('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('user', 'name email phone')
      .populate('car', 'name brand model year price')
      .populate('manager', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Заказ не найден' });
    }

    res.json(order);
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при обновлении заказа', error: error.message });
  }
});

// Удалить заказ
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Заказ не найден' });
    }
    res.json({ message: 'Заказ успешно удален' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении заказа', error: error.message });
  }
});

module.exports = router;