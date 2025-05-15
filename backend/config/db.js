const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Configure dotenv to load environment variables
dotenv.config();

const connectDB = async () => {
  try {
    // Get connection string from environment variables
    const mongoURI = process.env.MONGODB_URI;
    
    // Check if connection string exists
    if (!mongoURI) {
      console.error('MongoDB connection error: MONGODB_URI is not defined in environment variables');
      process.exit(1);
    }

    // Add connection options to handle deprecation warnings and reconnection
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 30
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };

    // Make connection attempt
    await mongoose.connect(mongoURI, options);
    
    console.log('MongoDB connected successfully');
    
    // Log connection information for debugging (redact sensitive info)
    const dbName = mongoose.connection.name;
    const dbHost = mongoose.connection.host;
    console.log(`Connected to database: ${dbName} on host: ${dbHost}`);
    
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.error('Error details:', {
      name: error.name,
      code: error.code,
      // Show more specific error details if available
      reason: error.reason ? error.reason.type : 'Unknown'
    });
    
    // Provide more helpful error messages based on common issues
    if (error.message.includes('ECONNREFUSED')) {
      console.error('\nTROUBLESHOOTING TIPS:');
      console.error('1. Make sure MongoDB is installed and running locally');
      console.error('2. Check if you\'re using the correct connection string:');
      console.error('   - Local MongoDB: mongodb://localhost:27017/yourdbname');
      console.error('   - MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/yourdbname');
      console.error('3. Verify there are no firewall issues blocking the connection');
      console.error('4. If using MongoDB Atlas, ensure your IP address is whitelisted\n');
    }
    
    process.exit(1);
  }
};

module.exports = connectDB;