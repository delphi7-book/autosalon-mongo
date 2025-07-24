const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['purchase', 'lease', 'credit', 'tradein']
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  downPayment: {
    type: Number,
    default: 0,
    min: 0
  },
  financing: {
    type: {
      type: String,
      enum: ['cash', 'credit', 'lease']
    },
    bank: String,
    term: Number,
    interestRate: Number,
    monthlyPayment: Number
  },
  tradeIn: {
    car: {
      brand: String,
      model: String,
      year: Number,
      mileage: Number,
      condition: String
    },
    estimatedValue: Number,
    finalValue: Number
  },
  insurance: {
    company: String,
    type: String,
    premium: Number,
    coverage: String
  },
  delivery: {
    type: {
      type: String,
      enum: ['pickup', 'delivery'],
      default: 'pickup'
    },
    address: String,
    date: Date,
    cost: {
      type: Number,
      default: 0
    }
  },
  documents: [{
    name: String,
    url: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  notes: String,
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Генерация номера заказа
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);