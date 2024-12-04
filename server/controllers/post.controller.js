const Post = require('../models/Post'); // Make sure to import your Post model

// Create a new post
const createPost = async (req, res) => {
  try {
    const newPost = new Post({
      user: req.user.id, // Assuming user info is attached to the request object by authentication middleware
      content: req.body.content, // Assuming content is passed in the request body
      // You can add other fields like images, timestamps, etc.
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a post by its ID
const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch a specific post by ID
const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch all posts (optional)
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }); // Fetch posts and sort by newest
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createPost,
  deletePost,
  getPost,
  getAllPosts,
};
