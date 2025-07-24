const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// Получить все обращения
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, subject, priority, assignedTo } = req.query;
    const query = {};
    
    if (status) query.status = status;
    if (subject) query.subject = subject;
    if (priority) query.priority = priority;
    if (assignedTo) query.assignedTo = assignedTo;

    const contacts = await Contact.find(query)
      .populate('assignedTo', 'name email')
      .populate('relatedCar', 'name brand model')
      .populate('responses.author', 'name role')
      .sort({ priority: 1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Contact.countDocuments(query);

    res.json({
      contacts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении обращений', error: error.message });
  }
});

// Получить обращение по ID
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('assignedTo', 'name email phone')
      .populate('relatedCar', 'name brand model year price images')
      .populate('responses.author', 'name email role');

    if (!contact) {
      return res.status(404).json({ message: 'Обращение не найдено' });
    }

    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении обращения', error: error.message });
  }
});

// Создать новое обращение
router.post('/', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    
    const populatedContact = await Contact.findById(contact._id)
      .populate('assignedTo', 'name email')
      .populate('relatedCar', 'name brand model');

    res.status(201).json(populatedContact);
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при создании обращения', error: error.message });
  }
});

// Обновить обращение
router.put('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('assignedTo', 'name email')
      .populate('relatedCar', 'name brand model')
      .populate('responses.author', 'name role');

    if (!contact) {
      return res.status(404).json({ message: 'Обращение не найдено' });
    }

    res.json(contact);
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при обновлении обращения', error: error.message });
  }
});

// Удалить обращение
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Обращение не найдено' });
    }
    res.json({ message: 'Обращение успешно удалено' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении обращения', error: error.message });
  }
});

module.exports = router;