const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define provider profile schema
const ProviderProfileSchema = new mongoose.Schema({
  // Basic Information
  businessName: String,
  phone_number: String,
  gender: String,
  address: String,
  region: String,
  profilePhotoUrl: String,
  
  // Professional Details
  categories: [String],
  services: [String],
  experience_years: Number,
  tools_available: [String],
  certifications: [{
    name: String,
    url: String,
    publicId: String,
    description: String
  }],
  
  // Performance & Status
  rating: { type: Number, default: 0 },
  total_jobs_done: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'pending'],
    default: 'pending'
  },
  is_verified: { type: Boolean, default: false },
  availability: {
    workingDays: [String],
    hours: {
      start: String,
      end: String
    },
    expressJobs: Boolean
  },
  
  // Payment & Bank Info
  bank_name: String,
  account_number: String,
  mobile_money: String,
  payment_method: {
    type: String,
    enum: ['Bank', 'Mobile Money', 'Both'],
    default: 'Mobile Money'
  },
  
  // Legacy fields (keep for compatibility)
  bio: String,
  hourlyRate: Number,
  providerType: {
    type: String,
    enum: ['individual', 'company'],
    default: 'individual'
  },
  employeeCount: Number,
  serviceArea: {
    city: String,
    neighborhood: String
  }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'provider'],
    default: 'user',
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  profilePhotoUrl: {
    type: String,
  },
  // Add provider profile schema
  providerProfile: ProviderProfileSchema,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
