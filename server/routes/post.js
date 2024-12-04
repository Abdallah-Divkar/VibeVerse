const express = require('express');
const router = express.Router();
const cloudinary = require('../config/config'); 
const Post = require("../models/Post");
const upload = require("../middleware/upload");
const { requireSignin, canDeletePost } = require('../controllers/auth.controller');
const { createPost, deletePost, getPost, getAllPosts } = require('../controllers/post.controller');

// Create a post with a required photo
router.post('/create', requireSignin, upload.single('photo'), async (req, res) => {
  try {
    const { content } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Photo is required' });
    }

    console.log('File path:', req.file.path);

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'vibeverse_posts',
    });

    // Create a new post
    const newPost = new Post({
      content,
      photo: result.secure_url, // Save Cloudinary URL
      user: req.user.id, // Attach user ID from auth middleware
    });

    await newPost.save();

    res.status(201).json({ success: true, post: newPost });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ success: false, message: 'Error creating post', error });
  }
});


// Route to get all posts
router.get('/', getAllPosts);

router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;  // Retrieve userId from the URL params
    console.log('User ID:', userId);  // Debug log to ensure correct user ID is passed

    const posts = await Post.find({ user: userId }).populate('user', 'username');


    if (!posts || posts.length === 0) {
      return res.status(404).json({ success: false, message: 'No posts found for this user' });
    }

    res.status(200).json({ success: true, posts });
  } catch (error) {
    console.error('Error fetching posts by user:', error);
    res.status(500).json({ success: false, message: 'Error fetching posts by user' });
  }
});


// Route to get a specific post by ID
router.get('/:postId', getPost);

// Route to delete a post by ID
router.delete('/:postId', requireSignin, canDeletePost, deletePost);

module.exports = router;
