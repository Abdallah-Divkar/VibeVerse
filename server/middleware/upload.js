const multer = require('multer');
const cloudinary = require('../config/config');  // Import the cloudinary instance correctly
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,  // Pass the cloudinary instance here
  params: {
    folder: 'vibeverse_posts',  // Your Cloudinary folder
    allowed_formats: ['jpeg', 'jpg', 'png'],
    public_id: (req, file) => `${Date.now()}-${file.originalname}`, // Unique public_id
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(file.originalname.toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only .jpg, .jpeg, and .png files are allowed.'));
  },
}).single('photo');  // Adjust according to your form field

module.exports = upload;
