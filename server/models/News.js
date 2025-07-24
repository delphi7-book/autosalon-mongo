const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  excerpt: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Новости компании', 'Новые модели', 'Акции', 'События', 'Обзоры', 'Советы']
  },
  tags: [String],
  featuredImage: {
    type: String,
    required: true
  },
  images: [String],
  status: {
    type: String,
    required: true,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishDate: {
    type: Date,
    default: Date.now
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  relatedCars: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car'
  }],
  isSticky: {
    type: Boolean,
    default: false
  },
  commentsEnabled: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Генерация slug
newsSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zа-я0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

// Индексы
newsSchema.index({ slug: 1 });
newsSchema.index({ status: 1, publishDate: -1 });
newsSchema.index({ category: 1, publishDate: -1 });

module.exports = mongoose.model('News', newsSchema);