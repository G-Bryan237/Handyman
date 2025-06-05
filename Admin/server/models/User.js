const mongoose = require('mongoose');

// Use the same schema as your main backend User model
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    default: ''
  },
  profilePhotoUrl: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'provider', 'admin'], // Changed 'client' to 'user'
    default: 'user' // Changed default from 'client' to 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Provider specific profile (matching your backend structure)
  providerProfile: {
    services: [{
      serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
      serviceName: String, // For quick access
      priceRange: {
        min: Number,
        max: Number
      },
      isActive: { type: Boolean, default: true }
    }],
    providerType: { type: String, enum: ['individual', 'company'], default: 'individual' },
    businessName: String,
    experience: Number,
    bio: String,
    hourlyRate: Number,
    certifications: [String],
    availability: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: []
    },
    serviceArea: String,
    payment: {
      methods: [String],
      bankDetails: mongoose.Schema.Types.Mixed,
      mobileMoneyDetails: mongoose.Schema.Types.Mixed
    },
    employeeCount: Number,
    metrics: {
      totalTransactions: { type: Number, default: 0 },
      last30DaysTransactions: { type: Number, default: 0 },
      successRate: { type: Number, default: 0 },
      averageRating: { type: Number, default: 0 },
      totalReviews: { type: Number, default: 0 },
      completionRate: { type: Number, default: 0 },
      responseTime: { type: Number, default: 0 }
    }
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // This creates createdAt and updatedAt automatically
});

// Method to check if user was active recently (within last 7 days)
userSchema.methods.isRecentlyActive = function() {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  return this.lastActivity > oneWeekAgo;
};

module.exports = mongoose.model('User', userSchema);