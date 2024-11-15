const multer = require('multer');

// Set storage engine to memory for easy upload to Cloudinary
const storage = multer.memoryStorage();

// Initialize multer with storage configuration
const upload = multer({ storage: storage });

module.exports = upload;
