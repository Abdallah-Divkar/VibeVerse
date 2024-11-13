const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2; // Require Cloudinary SDK
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');
const multer = require('multer');  // Use multer for handling file uploads
require("dotenv").config();

const app = express();

// Middleware
app.use(bodyParser.json());

// Set up Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Use your Cloudinary credentials from .env
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Set up multer storage (if you're handling file uploads to Cloudinary from your backend)
const storage = multer.memoryStorage(); // We will use memoryStorage to store images in memory temporarily
const upload = multer({ storage: storage });

// Connect to MongoDB (update with your actual connection string)
mongoose.connect('mongodb://localhost/social-media-db', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Routes (you'll define these later)
app.get('/', (req, res) => {
  res.send('Welcome to the Social Media App');
});

// Example route to handle image upload to Cloudinary
app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
            if (error) {
                console.error('Cloudinary upload error:', error);
                return res.status(500).send('Error uploading image');
            }

            // Respond with the uploaded image URL
            res.json({ url: result.secure_url });
        });

        // Pipe the file buffer to Cloudinary's upload stream
        result.end(req.file.buffer);

    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).send('Error uploading image');
    }
});

// Routes for posts and comments (you'll define these later)
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

// Server listening using the PORT from the .env file
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
