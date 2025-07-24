const express = require('express');
const router = express.Router();
const News = require('../models/News');

// Получить все новости
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, status = 'published', author } = req.query;
    const query = {};
    
    if (category) query.category = category;
    if (status !== 'all') query.status = status;
    if (author) query.author = author;

    const news = await News.find(query)
      .populate('author', 'name avatar')
      .populate('relatedCars', 'name brand model price images')
      .sort({ isSticky: -1, publishDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await News.countDocuments(query);

    res.json({
      news,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении новостей', error: error.message });
  }
});

// Получить новость по ID или slug
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    let query = {};
    
    // Проверяем, является ли identifier ObjectId или slug
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      query._id = identifier;
    } else {
      query.slug = identifier;
    }

    const news = await News.findOne(query)
      .populate('author', 'name email avatar')
      .populate('relatedCars', 'name brand model year price images');

    if (!news) {
      return res.status(404).json({ message: 'Новость не найдена' });
    }

    // Увеличиваем счетчик просмотров
    news.views += 1;
    await news.save();

    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении новости', error: error.message });
  }
});

// Создать новую новость
router.post('/', async (req, res) => {
  try {
    const news = new News(req.body);
    await news.save();
    
    const populatedNews = await News.findById(news._id)
      .populate('author', 'name avatar')
      .populate('relatedCars', 'name brand model');

    res.status(201).json(populatedNews);
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при создании новости', error: error.message });
  }
});

// Обновить новость
router.put('/:id', async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('author', 'name avatar')
      .populate('relatedCars', 'name brand model');

    if (!news) {
      return res.status(404).json({ message: 'Новость не найдена' });
    }

    res.json(news);
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при обновлении новости', error: error.message });
  }
});

// Удалить новость
router.delete('/:id', async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'Новость не найдена' });
    }
    res.json({ message: 'Новость успешно удалена' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении новости', error: error.message });
  }
});

module.exports = router;