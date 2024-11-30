const User = require("../models/User");

// Middleware: Retrieve user by ID
exports.userByID = async (req, res, next, id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.profile = user; // Attach user to the request
    next();
  } catch (error) {
    return res.status(500).json({ error: "Could not retrieve user" });
  }
};

// List all users
exports.list = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch users" });
  }
};

// Create a new user
exports.create = async (req, res) => {
  try {
    const user = new User(req.body);
    if (req.file) {
      // Upload profile picture to Cloudinary
      const result = await cloudinary.uploader.upload_stream({
        resource_type: "image",
      });
      user.profilePic = result.secure_url;
    }
    await user.save();
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ error: "Could not create user" });
  }
};

// Read user details
exports.read = (req, res) => {
  req.profile.password = undefined; // Exclude sensitive information
  res.json(req.profile);
};

// Update user
exports.update = async (req, res) => {
  try {
    let user = req.profile;
    Object.assign(user, req.body); // Merge request body into user object
    if (req.file) {
      const result = await cloudinary.uploader.upload_stream({
        resource_type: "image",
      });
      user.profilePic = result.secure_url;
    }
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Could not update user" });
  }
};

// Delete user
exports.remove = async (req, res) => {
  try {
    const user = req.profile;
    await user.remove();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Could not delete user" });
  }
};

// Follow another user
exports.follow = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.body.userId,
      { $addToSet: { following: req.params.userId } },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Could not follow user" });
  }
};

// Unfollow a user
exports.unfollow = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.body.userId,
      { $pull: { following: req.params.userId } },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Could not unfollow user" });
  }
};

// Get user posts
exports.userPosts = async (req, res) => {
  try {
    const posts = await Post.find({ postedBy: req.params.userId }); // Assuming a Post model
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch user posts" });
  }
};

// Get user profile
exports.profile = (req, res) => {
  req.profile.password = undefined;
  res.json(req.profile);
};
