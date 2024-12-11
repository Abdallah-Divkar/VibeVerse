// middleware/upload.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/config'); // Assuming cloudinary is exported from your config file

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary.cloudinary, // Cloudinary instance from the config file
  params: {
    folder: 'uploads', // Specify the folder in Cloudinary
    allowed_formats: ['jpeg', 'jpg', 'png'], // Allowed file types
    public_id: (req, file) => `${Date.now()}-${file.originalname}`, // Unique file name
  },
});

// Multer upload middleware
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(file.originalname.toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only .jpg, .jpeg, and .png files are allowed.'));
  },
}).single('profilePic'); // Adjust the field name if necessary (e.g., 'profilePic')

module.exports = upload;
