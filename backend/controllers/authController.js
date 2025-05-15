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
        address: user.address
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

// Add new becomeProvider function
exports.becomeProvider = async (req, res) => {
  try {
    console.log('[Controller] becomeProvider called with data:', req.body);
    
    // Find user by id from auth middleware
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update user role to provider
    user.role = 'provider';
    
    // Create or update provider profile
    // Consider adding a separate Provider model in the future for more details
    user.providerProfile = {
      businessName: req.body.businessName,
      experience: req.body.experience,
      bio: req.body.bio,
      services: req.body.services,
      hourlyRate: req.body.hourlyRate,
      providerType: req.body.providerType,
      profilePhotoUrl: req.body.profilePhotoUrl,
      certifications: req.body.certifications,
      availability: req.body.availability,
      serviceArea: req.body.serviceArea,
      payment: req.body.payment
    };
    
    // If provider is a company, store employee count
    if (req.body.providerType === 'company') {
      user.providerProfile.employeeCount = req.body.employeeCount;
    }
    
    // Save the updated user
    await user.save();
    
    // Return success response
    res.status(200).json({
      success: true,
      message: 'Successfully registered as a provider',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePhotoUrl: user.profilePhotoUrl,
        providerProfile: user.providerProfile
      }
    });
  } catch (error) {
    console.error('Provider registration error:', error);
    res.status(500).json({ error: 'Server error during provider registration' });
  }
};
