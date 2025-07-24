const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Техническое обслуживание', 'Диагностика', 'Ремонт двигателя', 'Кузовной ремонт', 'Шиномонтаж', 'Электрика', 'Кондиционер', 'Тюнинг']
  },
  description: {
    type: String,
    required: true
  },
  price: {
    from: {
      type: Number,
      required: true,
      min: 0
    },
    to: {
      type: Number,
      min: 0
    }
  },
  duration: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  requirements: [String],
  includes: [String],
  excludes: [String],
  warranty: {
    period: String,
    description: String
  },
  applicableBrands: [String],
  difficulty: {
    type: String,
    enum: ['Простая', 'Средняя', 'Сложная'],
    default: 'Средняя'
  },
  popularity: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);