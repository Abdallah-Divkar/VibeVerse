const jwt = require('jsonwebtoken');
const User = require('../models/User');
//const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const cloudinary = require('../config/config').cloudinary;
const Post = require('../models/Post');
const fs = require('fs');
const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;

// Create a user with Cloudinary integration
const create = async (req, res) => {
  try {
    const { name, username, email, password, profilePic } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    let profilePicUrl = profilePic || ''; // If profilePic is not provided, use empty string
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'user_profiles',
        public_id: `profile_pic_${Date.now()}`,
      });
      profilePicUrl = result.secure_url; // Cloudinary URL
    }

    // Create the user object and save
    const user = new User({
      name,
      username,
      email,
      password, // Hashing will be handled by Mongoose pre-save hooks if needed
      profilePic: profilePicUrl, // Store Cloudinary URL
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '3d' }
    );

    return res.json({
      message: 'User created successfully',
      user,
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: "Could not create user" });
  }
};

/*const create = async (req, res) => {
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
      userName: req.body.username,
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
};*/

// Update a user's profile with optional image upload
const update = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { userId } = req.params;

    // Check if the user is updating their own profile
    if (req.user._id.toString() !== userId) {
      return res.status(403).json({ error: 'You can only update your own profile' });
    }

    let profilePicUrl = req.body.profilePic || req.user.profilePic;

    if (req.file) {
      // Validate the uploaded file type (image only)
      const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validMimeTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ error: 'Invalid file type. Only images are allowed' });
      }

      // If the user has an existing profile picture, delete it from Cloudinary
      if (req.user.profilePic) {
        const publicId = req.user.profilePic.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }

      // Upload the new profile picture to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'user_profiles',
        public_id: `profile_pic_${userId}`,
      });

      // Update the profile picture URL
      profilePicUrl = result.secure_url;
    }

    // Update the user's profile with the new data
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { ...req.body, profilePic: profilePicUrl },
      { new: true }
    );

    return res.status(200).json(updatedUser);
  } catch (err) {
    console.error('Error updating user profile:', err);
    return res.status(400).json({ error: "Could not update user", details: err.message });
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
    const { userId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid User ID format" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error("Error retrieving user:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// Get user's profile by ID or username
const profile = async (req, res) => {
  try {
    const { userId, username } = req.params;

    let user;
    if (userId) {
      // Find user by ID
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid User ID format" });
      }
      user = await User.findById(userId);
    } else if (username) {
      // Find user by username
      user = await User.findOne({ username });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return profile with follower/following counts
    return res.status(200).json({
      name: user.name,
      email: user.email,
      bio: user.bio,
      followers: user.followers.length,
      following: user.following.length,
      created: user.created,
      updated: user.updated,
    });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body; // Extract the profilePic URL from the request body

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Update the user's profile with the new profile picture URL
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id, 
      { profilePic }, // Only update the profilePic field
      { new: true }
    );

    return res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error updating profile' });
  }
};

// Get all posts by a specific user
const userPosts = async (req, res) => {
  try {
    const posts = await Post.find({ createdBy: req.params.userId })
      .populate('createdBy', '_id name')
      .sort({ createdAt: -1 }); // Sort by most recent posts

    if (!posts || posts.length === 0) {
      return res.status(404).json({ error: "No posts found for this user" });
    }

    return res.json(posts);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: "Could not retrieve user's posts" });
  }
};

// Delete a user
const remove = async (req, res) => {
  try {
    // Get user ID from request parameters
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the logged-in user is authorized to delete this user
    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized to delete this user" });
    }

    // Delete the user from the database
    await user.remove();

    return res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "An error occurred during deletion" });
  }
};

// List all users (used in the route "/")
const list = async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from the database
    return res.json(users); // Send the list of users as the response
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: "Could not fetch users" });
  }
};

// Follow user
const follow = async (req, res) => {
  try {
    const { userId, username } = req.params;
    const currentUser = req.user._id; // Assume req.user is populated after authentication

    let userToFollow;

    // Validate and fetch user
    if (userId) {
      if (!ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid userId" });
      }
      userToFollow = await User.findById(userId);
    } else {
      userToFollow = await User.findOne({ username });
    }

    if (!userToFollow) {
      return res.status(404).json({ error: "User not found" });
    }

    if (userToFollow.followers.includes(currentUser)) {
      return res.status(400).json({ message: "Already following this user" });
    }

    userToFollow.followers.push(currentUser);
    await userToFollow.save();

    const currentUserObj = await User.findById(currentUser);
    currentUserObj.following.push(userToFollow._id);
    await currentUserObj.save();

    return res.status(200).json({ message: "Followed successfully", user: userToFollow });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Could not follow user" });
  }
};

// Unfollow user
const unfollow = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUser = req.user._id; // Assume req.user is populated after authentication

    // Check if the user exists
    const userToUnfollow = await User.findById(userId);
    if (!userToUnfollow) {
      return res.status(404).json({ error: "User not found" });
    }

    // Remove the follower and update the following list
    userToUnfollow.followers.pull(currentUser);
    await userToUnfollow.save();

    const currentUserObj = await User.findById(currentUser);
    currentUserObj.following.pull(userId);
    await currentUserObj.save();

    return res.status(200).json({ message: "Unfollowed successfully", user: userToUnfollow });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Could not unfollow user" });
  }
};


// Export all functions
module.exports = {
  create,
  update,
  userByID,
  read,
  profile,
  updateProfile,
  userPosts,
  remove,
  list,
  follow,
  unfollow
};
