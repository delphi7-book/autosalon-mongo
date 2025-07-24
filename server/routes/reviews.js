const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// Получить все отзывы
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, type, car, service, rating, isPublished = true } = req.query;
    const query = {};
    
    if (type) query.type = type;
    if (car) query.car = car;
    if (service) query.service = service;
    if (rating) query.rating = Number(rating);
    if (isPublished !== 'all') query.isPublished = isPublished === 'true';

    const reviews = await Review.find(query)
      .populate('user', 'name avatar')
      .populate('car', 'name brand model year')
      .populate('service', 'name category')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments(query);

    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении отзывов', error: error.message });
  }
});

// Получить отзыв по ID
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('user', 'name email avatar')
      .populate('car', 'name brand model year images')
      .populate('service', 'name category description')
      .populate('responses.author', 'name role');

    if (!review) {
      return res.status(404).json({ message: 'Отзыв не найден' });
    }

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении отзыва', error: error.message });
  }
});

// Создать новый отзыв
router.post('/', async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    
    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name avatar')
      .populate('car', 'name brand model')
      .populate('service', 'name category');

    res.status(201).json(populatedReview);
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при создании отзыва', error: error.message });
  }
});

// Обновить отзыв
router.put('/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('user', 'name avatar')
      .populate('car', 'name brand model')
      .populate('service', 'name category');

    if (!review) {
      return res.status(404).json({ message: 'Отзыв не найден' });
    }

    res.json(review);
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при обновлении отзыва', error: error.message });
  }
});

// Удалить отзыв
router.delete('/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Отзыв не найден' });
    }
    res.json({ message: 'Отзыв успешно удален' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении отзыва', error: error.message });
  }
});

module.exports = router;