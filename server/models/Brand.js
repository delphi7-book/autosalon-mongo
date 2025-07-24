const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  logo: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  founded: {
    type: Number,
    required: true
  },
  website: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  models: [{
    name: String,
    category: String,
    priceRange: {
      min: Number,
      max: Number
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Brand', brandSchema);