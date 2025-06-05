const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Import the User model
const User = require('../models/User');

// Dashboard stats endpoint
router.get('/dashboard/stats', async (req, res) => {
  try {
    console.log('Fetching dashboard stats...');
    
    const totalUsers = await User.countDocuments();
    const totalProviders = await User.countDocuments({ role: 'provider' });
    const totalClients = await User.countDocuments({ role: 'user' });
    const verifiedProviders = await User.countDocuments({ role: 'provider', isVerified: true });
    
    const stats = {
      totalUsers,
      totalProviders,
      totalClients,
      verifiedProviders,
      pendingProviders: totalProviders - verifiedProviders
    };
    
    console.log('Dashboard stats:', stats);
    res.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// User growth endpoint
router.get('/users/growth', async (req, res) => {
  try {
    const { period = '6months' } = req.query;
    
    // Calculate date range based on period
    let startDate = new Date();
    switch (period) {
      case '3months':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case '6months':
        startDate.setMonth(startDate.getMonth() - 6);
        break;
      case '1year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 6);
    }

    // Aggregate users by month and role
    const growth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            role: "$role"
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    // Transform data into chart format
    const chartData = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    growth.forEach(item => {
      const monthKey = `${months[item._id.month - 1]} ${item._id.year}`;
      if (!chartData[monthKey]) {
        chartData[monthKey] = { month: monthKey, clients: 0, providers: 0 };
      }
      
      if (item._id.role === 'user') {
        chartData[monthKey].clients = item.count;
      } else if (item._id.role === 'provider') {
        chartData[monthKey].providers = item.count;
      }
    });

    const formattedData = Object.values(chartData);
    
    console.log('User growth data:', formattedData);
    res.json(formattedData);
    
  } catch (error) {
    console.error('User growth error:', error);
    res.status(500).json({ error: 'Failed to fetch user growth data' });
  }
});

// Recent activity endpoint
router.get('/users/recent-activity', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    // Get recently created users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select('name email role createdAt');

    // Transform into activity format
    const activities = recentUsers.map(user => ({
      user: user.name,
      action: user.role === 'provider' ? 'registered as a service provider' : 'joined as a client',
      type: user.role === 'provider' ? 'provider' : 'client',
      time: getTimeAgo(user.createdAt)
    }));

    console.log('Recent activities:', activities);
    res.json(activities);
    
  } catch (error) {
    console.error('Recent activity error:', error);
    res.status(500).json({ error: 'Failed to fetch recent activity' });
  }
});

// Helper function to format time ago
function getTimeAgo(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return date.toLocaleDateString();
}

// Get users endpoint
router.get('/users', async (req, res) => {
  try {
    console.log('Fetching users with params:', req.query);
    
    const { role, search, page = 1, limit = 50 } = req.query;
    
    // Build query
    let query = {};
    
    if (role) {
      query.role = role;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    console.log('MongoDB query:', query);
    
    // Execute query
    const users = await User.find(query)
      .select('-password') // Exclude password from results
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await User.countDocuments(query);
    
    console.log(`Found ${users.length} users out of ${total} total`);
    
    res.json({
      users,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit))
    });
    
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Create user endpoint
router.post('/users', async (req, res) => {
  try {
    console.log('Creating new user with data:', req.body);
    
    const { name, email, phone, password, role } = req.body;
    
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ 
        error: 'Name, email, and password are required' 
      });
    }
    
    // Validate role
    const validRoles = ['user', 'provider', 'admin'];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ 
        error: 'Invalid role. Must be user, provider, or admin' 
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        error: 'User with this email already exists' 
      });
    }
    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create new user data
    const userData = {
      name,
      email,
      phone: phone || '',
      password: hashedPassword,
      role: role || 'user',
      isVerified: false,
      isActive: true,
      lastActivity: new Date()
    };
    
    // If creating a provider, initialize provider profile
    if (role === 'provider') {
      userData.providerProfile = {
        services: [],
        providerType: 'individual',
        metrics: {
          totalTransactions: 0,
          last30DaysTransactions: 0,
          successRate: 0,
          averageRating: 0,
          totalReviews: 0,
          completionRate: 0,
          responseTime: 0
        }
      };
    }
    
    // Create new user
    const newUser = new User(userData);
    
    // Save user to database
    const savedUser = await newUser.save();
    
    console.log('User created successfully:', savedUser._id);
    
    // Return success response (exclude password)
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        phone: savedUser.phone,
        role: savedUser.role,
        isVerified: savedUser.isVerified,
        isActive: savedUser.isActive,
        createdAt: savedUser.createdAt,
        providerProfile: savedUser.providerProfile || null
      }
    });
    
  } catch (error) {
    console.error('Create user error:', error);
    
    // Handle duplicate key error (email already exists)
    if (error.code === 11000) {
      return res.status(400).json({ 
        error: 'User with this email already exists' 
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        error: 'Validation error', 
        details: messages 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to create user', 
      details: error.message 
    });
  }
});

module.exports = router;