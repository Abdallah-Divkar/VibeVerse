const User = require('../models/User');
const cloudinary = require('../config/config').cloudinary; // Import Cloudinary config
const Post = require('../models/post.model');
const fs = require('fs'); // To handle file system (for multer)

// Create user controller with Cloudinary integration
const create = async (req, res) => {
  try {
    let profilePicUrl = req.body.profilePic || ''; // Default to empty string if no profilePic provided

    // Check if an image file is provided in the request
    if (req.file) {
      // Upload the file to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'user_profiles', // Optionally specify a folder in Cloudinary
        public_id: `profile_pic_${Date.now()}` // Optionally set a custom public ID
      });

      profilePicUrl = result.secure_url; // Get the Cloudinary URL of the uploaded image
    }

    // Create a new user with the profile picture URL if provided
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      profilePic: profilePicUrl // Store the Cloudinary URL in the profilePic field
    });

    // Save user to the database
    await user.save();

    return res.json({ user });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: "Could not create user" });
  }
};

// Update user profile with optional image upload
const update = async (req, res) => {
  try {
    let profilePicUrl = req.body.profilePic || req.user.profilePic; // Default to existing profilePic if not updated

    // Check if a new profile picture is uploaded
    if (req.file) {
      // Upload the new image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'user_profiles', // Specify a folder in Cloudinary
        public_id: `profile_pic_${req.user._id}` // Optionally set a custom public ID for the user
      });

      // Use the Cloudinary URL of the uploaded image
      profilePicUrl = result.secure_url;
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

const userByID = async (req, res, next, id) => {
  try {
      let user = await User.findById(id);
      if (!user)
          return res.status('400').json({
              error: "User not found"
          });
      req.profile = user;
      next();
  } catch (err) {
      return res.status('400').json({
          error: "Could not retrieve user"
      });
  }
};

// Get user by ID
const read = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: "Could not retrieve user" });
  }
};

// Get user profile
const profile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('followers', '_id name')
      .populate('following', '_id name')
      .select('name email bio followers following created updated');

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

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

// List all users
const list = async (req, res) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: "Could not retrieve users" });
  }
};

// Delete user
const remove = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.userId);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: "Could not delete user" });
  }
};

// Follow user
const follow = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const followUser = await User.findById(req.params.userId);

    if (!followUser) {
      return res.status(404).json({ error: "User to follow not found" });
    }

    // Add follower to the followee's followers list
    followUser.followers.push(user._id);
    user.following.push(followUser._id);

    await user.save();
    await followUser.save();

    return res.json({ message: "User followed successfully" });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: "Could not follow user" });
  }
};

// Unfollow user
const unfollow = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const unfollowUser = await User.findById(req.params.userId);

    if (!unfollowUser) {
      return res.status(404).json({ error: "User to unfollow not found" });
    }

    // Remove follower from the followee's followers list
    unfollowUser.followers.pull(user._id);
    user.following.pull(unfollowUser._id);

    await user.save();
    await unfollowUser.save();

    return res.json({ message: "User unfollowed successfully" });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: "Could not unfollow user" });
  }
};
// ger user posts profile
const userPosts = async (req, res) => {
  try {
      let posts = await Post.find({ postedBy: req.params.userId })
          .populate('postedBy', '_id name')
          .sort('-created');
      
      res.json(posts);
  } catch (err) {
      console.error(err);
      return res.status(400).json({ error: "Could not fetch user posts" });
  }
};

// Export all functions at the end
module.exports = {
  userPosts,
  create,
  update,
  userByID,
  read,
  profile,
  list,
  remove,
  follow,
  unfollow
};