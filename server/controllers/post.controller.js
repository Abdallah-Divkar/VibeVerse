const Post = require('../models/Post'); // Make sure to import your Post model

// Create a new post
const createPost = async (req, res) => {
  try {
    const { content } = req.body; // Caption for the post
    const { path } = req.file; // Path of the uploaded file (image/video)

    // Assuming you're storing the file URL in the 'photo' field of the post
    const newPost = await Post.create({
      content,
      photo: path, // Store the file path (or Cloudinary URL if uploaded there)
      userId: req.user.id, // Assuming the post is tied to a user
    });

    res.status(201).json({ message: "Post created successfully!", post: newPost });
  } catch (err) {
    res.status(500).json({ message: "Error creating post", error: err.message });
  }
};


/*const createPost = async (req, res) => {
  const { title, content, image } = req.body;
  try {
    const newPost = new Post({ title, content, image });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post' });
  }
};*/

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

const getPostsByUser = async (req, res) => {
  try {
    const userId = req.params.userId; // Get user ID from the route parameter

    // Find posts by user ID
    const posts = await Post.find({ user: userId })
      .populate('user', 'username profilePic') // Optionally, populate user data
      .populate('comments'); // Optionally, populate comments

    if (!posts || posts.length === 0) {
      return res.status(404).json({ success: false, message: 'No posts found for this user' });
    }

    res.status(200).json(posts); // Return the found posts
  } catch (error) {
    console.error('Error fetching posts by user:', error);
    res.status(500).json({ success: false, message: 'Error fetching posts', error });
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
  getPostsByUser,
  getPost,
  getAllPosts,
};
