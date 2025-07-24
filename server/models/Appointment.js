const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['test-drive', 'service', 'consultation', 'inspection', 'delivery']
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car'
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  duration: {
    type: Number,
    required: true,
    default: 60
  },
  notes: String,
  customerInfo: {
    name: String,
    phone: String,
    email: String,
    drivingExperience: String
  },
  carInfo: {
    brand: String,
    model: String,
    year: Number,
    vin: String,
    mileage: Number,
    issues: String
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reminder: {
    sent: {
      type: Boolean,
      default: false
    },
    sentAt: Date
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    submittedAt: Date
  }
}, {
  timestamps: true
});

// Индекс для поиска по дате и времени
appointmentSchema.index({ date: 1, time: 1 });
appointmentSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);