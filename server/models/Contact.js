const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    enum: ['Покупка автомобиля', 'Сервисное обслуживание', 'Trade-in', 'Кредитование', 'Страхование', 'Жалоба', 'Предложение', 'Другое']
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['new', 'in-progress', 'resolved', 'closed'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  responses: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: String,
    date: {
      type: Date,
      default: Date.now
    },
    isInternal: {
      type: Boolean,
      default: false
    }
  }],
  source: {
    type: String,
    enum: ['website', 'phone', 'email', 'chat', 'social'],
    default: 'website'
  },
  tags: [String],
  relatedCar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car'
  },
  customerType: {
    type: String,
    enum: ['new', 'existing', 'returning'],
    default: 'new'
  }
}, {
  timestamps: true
});

// Индексы
contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ assignedTo: 1, status: 1 });
contactSchema.index({ subject: 1, priority: 1 });

module.exports = mongoose.model('Contact', contactSchema);