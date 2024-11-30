<<<<<<< HEAD
// Test controller function
exports.test = (req, res) => {
  res.send("User controller is working!");
};

// Example function to list all users (mock data)
exports.list = (req, res) => {
  const mockUsers = [
    { id: 1, name: "User One", email: "userone@example.com" },
    { id: 2, name: "User Two", email: "usertwo@example.com" },
  ];
  res.json(mockUsers); // Send the mock data as a JSON response
};
=======
const User = require('../models/User');
const cloudinary = require('../config/config').cloudinary;
const Post = require('../models/Post');
const fs = require('fs');

// Create a user with Cloudinary integration
const create = async (req, res) => {
  try {
    let profilePicUrl = req.body.profilePic || ''; // Default to an empty string if no profile picture is provided

    // Check if an image file is provided in the request
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'user_profiles', // Optional: Specify a folder in Cloudinary
        public_id: `profile_pic_${Date.now()}` // Optional: Set a custom public ID
      });
      profilePicUrl = result.secure_url; // Get the Cloudinary URL of the uploaded image
    }

    // Create a new user with the provided profile picture URL
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      profilePic: profilePicUrl // Store the Cloudinary URL in the profilePic field
    });

    // Save the user to the database
    await user.save();
    return res.json({ user });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: "Could not create user" });
  }
};

// Update a user's profile with optional image upload
const update = async (req, res) => {
  try {
    let profilePicUrl = req.body.profilePic || req.user.profilePic; // Default to the existing profile picture if not updated

    // Check if a new profile picture is uploaded
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'user_profiles', // Specify a folder in Cloudinary
        public_id: `profile_pic_${req.user._id}` // Optional: Set a custom public ID for the user
      });
      profilePicUrl = result.secure_url; // Get the Cloudinary URL of the uploaded image
    }

    // Update the user's information, including the new profile picture URL
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { ...req.body, profilePic: profilePicUrl },
      { new: true } // Ensure the updated user is returned
    );

    return res.json(updatedUser);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: "Could not update user" });
  }
};

// Get user by ID middleware
const userByID = async (req, res, next, id) => {
  try {
    const user = await User.findById(id);
    if (!user) return res.status(400).json({ error: "User not found" });
    req.profile = user; // Attach the user to the request object
    next();
  } catch (err) {
    return res.status(400).json({ error: "Could not retrieve user" });
  }
};

// Get a user by ID
const read = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: "Could not retrieve user" });
  }
};

// Get a user's profile
const profile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('followers', '_id name')
      .populate('following', '_id name')
      .select('name email bio followers following created updated');

    if (!user) return res.status(404).json({ error: "User not found" });

    return res.json({
      name: user.name,
      email: user.email,
      bio: user.bio,
      followers: user.followers.length,
      following: user.following.length,
      created: user.created,
      updated: user.updated
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: "Could not fetch user profile" });
  }
};

// Delete a user
const remove = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.userId);
    if (!deletedUser) return res.status(404).json({ error: "User not found" });
    return res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: "Could not delete user" });
  }
};

// Delete a post with authorization
const deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;

    // Find the post by ID
    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ error: "Post not found" });

    // Check if the requesting user is the owner of the post
    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized to delete this post" });
    }

    // Remove the post
    await post.remove();
    return res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: "Could not delete post" });
  }
};

// Export all functions
module.exports = {
  create,
  update,
  userByID,
  read,
  profile,
  remove,
  deletePost
};
>>>>>>> 546ab6ccb475ab7290a2299402ec25af48562329
