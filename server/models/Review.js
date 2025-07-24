const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car'
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  type: {
    type: String,
    required: true,
    enum: ['car', 'service', 'company', 'manager']
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  comment: {
    type: String,
    required: true
  },
  pros: [String],
  cons: [String],
  images: [String],
  isVerified: {
    type: Boolean,
    default: false
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  helpful: {
    type: Number,
    default: 0
  },
  responses: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: String,
    date: {
      type: Date,
      default: Date.now
    },
    isOfficial: {
      type: Boolean,
      default: false
    }
  }],
  moderationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Индексы
reviewSchema.index({ car: 1, rating: -1 });
reviewSchema.index({ user: 1, createdAt: -1 });
reviewSchema.index({ isPublished: 1, moderationStatus: 1 });

module.exports = mongoose.model('Review', reviewSchema);