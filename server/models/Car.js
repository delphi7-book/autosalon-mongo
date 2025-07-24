const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: true
  },
  model: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear() + 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  mileage: {
    type: Number,
    default: 0,
    min: 0
  },
  fuel: {
    type: String,
    required: true,
    enum: ['Бензин', 'Дизель', 'Гибрид', 'Электро', 'Газ']
  },
  transmission: {
    type: String,
    required: true,
    enum: ['Механическая', 'Автоматическая', 'Робот', 'Вариатор']
  },
  bodyType: {
    type: String,
    required: true,
    enum: ['Седан', 'Хэтчбек', 'Универсал', 'Кроссовер', 'Внедорожник', 'Купе', 'Кабриолет', 'Минивэн']
  },
  drive: {
    type: String,
    required: true,
    enum: ['Передний', 'Задний', 'Полный']
  },
  engine: {
    volume: {
      type: Number,
      required: true,
      min: 0.5,
      max: 10
    },
    power: {
      type: Number,
      required: true,
      min: 50,
      max: 2000
    },
    type: {
      type: String,
      required: true,
      enum: ['Бензиновый', 'Дизельный', 'Электрический', 'Гибридный']
    }
  },
  color: {
    type: String,
    required: true
  },
  vin: {
    type: String,
    required: true,
    unique: true,
    length: 17
  },
  images: [{
    type: String,
    required: true
  }],
  features: [{
    type: String
  }],
  description: {
    type: String,
    required: true
  },
  condition: {
    type: String,
    required: true,
    enum: ['Новый', 'Б/у', 'Восстановленный'],
    default: 'Новый'
  },
  availability: {
    type: String,
    required: true,
    enum: ['В наличии', 'Под заказ', 'Продан'],
    default: 'В наличии'
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  specifications: {
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      wheelbase: Number
    },
    weight: Number,
    fuelTank: Number,
    trunkVolume: Number,
    doors: Number,
    seats: Number,
    maxSpeed: Number,
    acceleration: Number,
    consumption: Number
  },
  isHit: {
    type: Boolean,
    default: false
  },
  isNew: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Индексы для поиска
carSchema.index({ name: 'text', model: 'text', description: 'text' });
carSchema.index({ brand: 1, price: 1 });
carSchema.index({ year: -1, price: 1 });
carSchema.index({ availability: 1 });

module.exports = mongoose.model('Car', carSchema);