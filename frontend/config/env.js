// Configuration file that centralizes environment variables for the app

// For React Native, we need to manually include environment variables
// since process.env isn't available at runtime like it is in Node.js

const Config = {
  // Cloudinary configuration
  CLOUDINARY_URL: 'https://api.cloudinary.com/v1_1/dbyxezboa/upload',
  CLOUDINARY_UPLOAD_PRESET: 'handyman_app',
  CLOUDINARY_CLOUD_NAME: 'dbyxezboa',
  
  // API configuration
  API_URL: 'https://your-api-url.com',
  
  // Other environment variables
  APP_ENV: 'development',
};

export default Config;
