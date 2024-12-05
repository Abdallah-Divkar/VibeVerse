import { CloudinaryContext } from 'cloudinary-react';

// Cloudinary configuration for frontend
const cloudinaryConfig = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

export default cloudinaryConfig;
