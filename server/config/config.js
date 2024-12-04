require('dotenv').config();
const cloudinary = require('cloudinary').v2;

// Configuring Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
/*module.exports = {
  port: process.env.PORT,
  mongoURI: process.env.MONGO_URI,  
  jwtSecret: process.env.JWT_SECRET,
  apiKey: process.env.API_KEY,   // Export Cloudinary configuration
};*/
