const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const auth = require("../controllers/auth.controller");
const { requireSignin } = require("../controllers/auth.controller");

//Creating a new post
router.post("/", requireSignin, async (req, res) => {
    const { title, content } = req.body;
    try {
      const post = new Post({ title, content, author: req.user._id });
      await post.save();
      res.status(201).json(post);
    } catch (err) {
      res.status(500).json({ message: "Server Error" });
    }
  });

//Routes for liking a post
router.post("/:id/like", requireSignin, async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);  // Use req.params.id instead of req.body.id
      if (!post) return res.status(404).json({ message: "Post not found" });
  
      if (post.likes.includes(req.user._id)) {  // Ensure req.user is the authenticated user's id
        return res.status(400).json({ message: "Post already liked" });
      }
  
      post.likes.push(req.user._id);  // Add the user's ID to the likes array
      await post.save();
      res.json({ message: "Post liked" });
    } catch (err) {
      res.status(500).json({ message: "Server Error" });
    }
});

//Update a post by id
router.put('/:id', async (req, res) => {
    const { title, content } = req.body;
  
    try {
      const post = await Post.findById(req.params.id);
      
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      // Update post fields
      post.title = title || post.title;
      post.content = content || post.content;
  
      await post.save();
  
      res.json(post);
    }
    catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
});

//Get all posts
router.get('/', async (req, res) => {
    try {
      const posts = await Post.find().populate('author', 'username');
      res.json(posts);
    } 
    catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
});

// Get a post by ID
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'username');
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json(post);
    } 
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete all posts
router.delete('/', async (req, res) => {
    try {
        const result = await Post.deleteMany({});

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No posts to delete' });
        }

        res.json({ message: 'All posts deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a post by ID
router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json({ message: 'Post deleted successfully' });
    } 
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
