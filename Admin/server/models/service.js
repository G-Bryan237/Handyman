const mongoose = require('mongoose');

// Services model
const serviceSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  category: { 
    type: String, 
    required: true,
    trim: true
  },
  description: { 
    type: String, 
    required: true
  },
  icon: {
    type: String,
    default: 'settings'
  },
  color: {
    type: String,
    default: '#000000'
  },
  priceRange: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 }
  },
  pricingModel: {
    type: String,
    enum: ['hourly', 'fixed', 'per_service', 'quote_based'],
    default: 'hourly'
  },
  availability: {
    regions: [{ type: String }],
    isNationwide: { type: Boolean, default: false }
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  tags: [{ type: String }],
  estimatedDuration: {
    min: { type: Number }, // in minutes
    max: { type: Number }  // in minutes
  },
  providersCount: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalBookings: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better query performance
serviceSchema.index({ category: 1, isActive: 1 });
serviceSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Service', serviceSchema);