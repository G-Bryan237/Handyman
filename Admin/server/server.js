const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:3001',
    'http://localhost:5173'  // Add this for your Vite dev server
  ],
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/handyman');
    console.log('MongoDB connected for Admin Dashboard - Database: HandyMan');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Import routes
const adminRoutes = require('./routes/adminRoutes');
// Import service routes
const serviceRoutes = require('./routes/serviceRoutes');

// Routes
app.use('/api/admin', adminRoutes);
// Connect service routes
app.use('/api/services', serviceRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Admin server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Admin server running on port ${PORT}`);
});