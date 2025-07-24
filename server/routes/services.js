const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

// Получить все услуги
router.get('/', async (req, res) => {
  try {
    const { category, isActive = true } = req.query;
    const query = {};
    
    if (category) query.category = category;
    if (isActive !== 'all') query.isActive = isActive === 'true';

    const services = await Service.find(query).sort({ popularity: -1, name: 1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении услуг', error: error.message });
  }
});

// Получить услугу по ID
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Услуга не найдена' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении услуги', error: error.message });
  }
});

// Создать новую услугу
router.post('/', async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при создании услуги', error: error.message });
  }
});

// Обновить услугу
router.put('/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({ message: 'Услуга не найдена' });
    }

    res.json(service);
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при обновлении услуги', error: error.message });
  }
});

// Удалить услугу
router.delete('/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Услуга не найдена' });
    }
    res.json({ message: 'Услуга успешно удалена' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении услуги', error: error.message });
  }
});

module.exports = router;