const jwt = require('jsonwebtoken');
const User = require('../models/User');
const cloudinary = require('../config/config').cloudinary;
//const Post = require('../models/Post');
const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;

const getUserProfile = async (req, res) => {
  try {
    const userId = req.auth.userId || req.params.userId || req.params.username;
    
    // Find the user by either userId or username
    const user = await User.findById(userId).select('-password'); // Exclude password field
    // Alternatively, if you're looking by username
    // const user = await User.findOne({ username: req.params.username }).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send the user object, including name, username, and other details
    res.status(200).json({
      user: {
        name: user.name,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
        followers: user.followers,
        following: user.following,
        bio: user.bio,
      }
    });
  } catch (error) {
    console.error('Error retrieving user profile:', error);
    res.status(500).json({ message: 'Error retrieving user profile', error });
  }
};

// Create a user with Cloudinary integration
const create = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    let profilePicUrl = 'https://res.cloudinary.com/daqkitloj/image/upload/v1733786820/default-profile-pic_axwxip.png';

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'user_profiles',
        public_id: `profile_pic_${Date.now()}`,
      });
      profilePicUrl = result.secure_url; // Cloudinary URL
    }

    const user = new User({
      name,
      username,
      email,
      password,
      profilePic: profilePicUrl,
    });

    await user.save();

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

const update = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { userId } = req.params;

    if (req.user._id.toString() !== userId) {
      return res.status(403).json({ error: 'You can only update your own profile' });
    }

    let profilePicUrl = req.body.profilePic || req.user.profilePic;

    if (req.file) {
      const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validMimeTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ error: 'Invalid file type. Only images are allowed' });
      }

      if (req.user.profilePic) {
        const publicId = req.user.profilePic.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'user_profiles',
        public_id: `profile_pic_${userId}`,
      });

      profilePicUrl = result.secure_url;
    }

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

const userByID = async (req, res, next, id) => {
  try {
    const user = await User.findById(id);
    if (!user) return res.status(400).json({ error: "User not found" });
    req.profile = user;
    next();
  } catch (err) {
    return res.status(400).json({ error: "Could not retrieve user" });
  }
};

const read = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ message: "User ID is required" });

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

const remove = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user._id.toString() !== userId) {
      return res.status(403).json({ error: 'You can only delete your own profile' });
    }

    // Find the user and delete them
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    return res.status(500).json({ error: 'Could not delete user' });
  }
};


const profile = async (req, res) => {
  try {
    const { userId, username } = req.params;

    let user;
    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid User ID format" });
      }
      user = await User.findById(userId);
    } else if (username) {
      user = await User.findOne({ username });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

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

const getUserStats = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).populate('followers following');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const stats = {
      followerCount: user.followers.length,
      followingCount: user.following.length,
    };
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user stats', error });
  }
};

const list = async (req, res) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: "Could not fetch users" });
  }
};

const follow = async (req, res) => {
  try {
    const { userId, username } = req.params;
    const currentUser = req.user._id;

    let userToFollow;

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

const unfollow = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUser = req.user._id;

    const userToUnfollow = await User.findById(userId);
    if (!userToUnfollow) {
      return res.status(404).json({ error: "User not found" });
    }

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

module.exports = {
  create,
  list,
  read,
  update,
  remove,
  follow,
  unfollow,
  profile,
  getUserStats,
  getUserProfile,
  userByID
};
