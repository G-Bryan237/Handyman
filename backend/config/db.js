const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Configure dotenv to load environment variables from .env file
dotenv.config();

/**
 * Establishes connection to MongoDB database
 * Uses the MONGODB_URI from environment variables
 * Handles connection errors and success
 */
const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using the connection string from .env
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Log success message if connection is established
    console.log('MongoDB connected Successfully');
  } catch (error) {
    // Log error details if connection fails
    console.error('MongoDB connection error:', error);
    
    // Exit the process with failure code (1) if connection fails
    process.exit(1);
  }
};

// Export the connectDB function to be used in server.js or app.js
module.exports = connectDB;