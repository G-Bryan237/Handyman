const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// Register new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, address } = req.body;
    
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    // Create new user
    const user = await User.create({
      name,
      email,
      password, // Will be hashed via pre-save hook
      role,
      phone,
      address
    });
    
    // Generate token
    const token = generateToken(user);
    
    // Return user data and token
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = generateToken(user);
    
    // Return user data and token
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        city: user.city,
        profilePhotoUrl: user.profilePhotoUrl,
        providerProfile: user.providerProfile
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone, address, city, profilePhotoUrl } = req.body;
    
    // Find user by id from auth middleware
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update user fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (city) user.city = city;
    if (profilePhotoUrl) user.profilePhotoUrl = profilePhotoUrl;
    
    // Save updated user
    await user.save();
    
    // Return updated user data
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        city: user.city,
        profilePhotoUrl: user.profilePhotoUrl
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Enhanced becomeProvider function to match comprehensive provider structure
exports.becomeProvider = async (req, res) => {
  try {
    console.log('[Controller] becomeProvider called with comprehensive data:', req.body);
    
    // Find user by id from auth middleware
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update user role to provider
    user.role = 'provider';
    
    // Create comprehensive provider profile
    user.providerProfile = {
      // Basic Information
      businessName: req.body.businessName,
      phone_number: req.body.phone_number || user.phone,
      gender: req.body.gender,
      address: req.body.address || user.address,
      region: req.body.region,
      profilePhotoUrl: req.body.profilePhotoUrl,
      
      // Professional Details
      categories: req.body.categories || [],
      services: req.body.services || [],
      experience_years: req.body.experience_years || 0,
      tools_available: req.body.tools_available || [],
      certifications: req.body.certifications || [],
      
      // Performance & Status
      rating: 0,
      total_jobs_done: 0,
      status: 'pending',
      is_verified: false,
      availability: req.body.availability || {
        workingDays: [],
        hours: { start: '09:00', end: '17:00' },
        expressJobs: false
      },
      
      // Payment & Bank Info
      bank_name: req.body.bank_name,
      account_number: req.body.account_number,
      mobile_money: req.body.mobile_money,
      payment_method: req.body.payment_method || 'Mobile Money',
      
      // Legacy fields for compatibility
      bio: req.body.bio,
      hourlyRate: req.body.hourlyRate,
      providerType: req.body.providerType || 'individual',
      employeeCount: req.body.employeeCount,
      serviceArea: {
        city: req.body.region,
        neighborhood: req.body.address
      }
    };
    
    // Save the updated user
    await user.save();
    
    // Return comprehensive success response
    res.status(200).json({
      success: true,
      message: 'Successfully registered as a provider',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        city: user.city,
        profilePhotoUrl: user.profilePhotoUrl,
        providerProfile: user.providerProfile
      }
    });
  } catch (error) {
    console.error('Provider registration error:', error);
    res.status(500).json({ error: 'Server error during provider registration' });
  }
};
