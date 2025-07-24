const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// Получить все записи
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type, date, user } = req.query;
    const query = {};
    
    if (status) query.status = status;
    if (type) query.type = type;
    if (user) query.user = user;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }

    const appointments = await Appointment.find(query)
      .populate('user', 'name email phone')
      .populate('car', 'name brand model year')
      .populate('service', 'name category price')
      .populate('manager', 'name email')
      .sort({ date: 1, time: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Appointment.countDocuments(query);

    res.json({
      appointments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении записей', error: error.message });
  }
});

// Получить запись по ID
router.get('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('user', 'name email phone address')
      .populate('car', 'name brand model year images')
      .populate('service', 'name category description price duration')
      .populate('manager', 'name email phone');

    if (!appointment) {
      return res.status(404).json({ message: 'Запись не найдена' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении записи', error: error.message });
  }
});

// Создать новую запись
router.post('/', async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    await appointment.save();
    
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('user', 'name email phone')
      .populate('car', 'name brand model')
      .populate('service', 'name category')
      .populate('manager', 'name email');

    res.status(201).json(populatedAppointment);
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при создании записи', error: error.message });
  }
});

// Обновить запись
router.put('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('user', 'name email phone')
      .populate('car', 'name brand model')
      .populate('service', 'name category')
      .populate('manager', 'name email');

    if (!appointment) {
      return res.status(404).json({ message: 'Запись не найдена' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при обновлении записи', error: error.message });
  }
});

// Удалить запись
router.delete('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Запись не найдена' });
    }
    res.json({ message: 'Запись успешно удалена' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении записи', error: error.message });
  }
});

module.exports = router;