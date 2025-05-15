const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define provider profile schema
const ProviderProfileSchema = new mongoose.Schema({
  businessName: String,
  experience: String,
  bio: String,
  services: [String],
  hourlyRate: Number,
  providerType: {
    type: String,
    enum: ['individual', 'company'],
    default: 'individual'
  },
  employeeCount: Number,
  profilePhotoUrl: String,
  certifications: [{
    name: String,
    url: String,
    publicId: String
  }],
  availability: {
    workingDays: [String],
    hours: {
      start: String,
      end: String
    },
    expressJobs: Boolean
  },
  serviceArea: {
    city: String,
    neighborhood: String
  },
  payment: {
    method: String,
    accountName: String,
    accountNumber: String
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
