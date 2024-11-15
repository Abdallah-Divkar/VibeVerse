require('dotenv').config();
const cloudinary = require('cloudinary').v2;

// Configuring Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  // Your Cloudinary Cloud Name
  api_key: process.env.CLOUDINARY_API_KEY,        // Your Cloudinary API Key
  api_secret: process.env.CLOUDINARY_API_SECRET   // Your Cloudinary API Secret
});

module.exports = {
  port: process.env.PORT,
  mongoURI: process.env.MONGO_URI,  
  jwtSecret: process.env.JWT_SECRET,
  apiKey: process.env.API_KEY,  
  cloudinary // Export Cloudinary configuration
};
