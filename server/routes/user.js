const express = require("express");
const { requireSignin } = require("../controllers/auth.controller");
const { createPost, deletePost } = require("../controllers/post.controller");
const router = express.Router();
const userCtrl = require("../controllers/user.controller");
const authCtrl = require("../controllers/auth.controller");
const postCtrl = require("../controllers/post.controller");
const upload = require("../middleware/upload");
const cloudinary = require('../config/config');
const User = require('../models/User');
const Post = require('../models/Post');
const fs = require('fs');

// Cloudinary configuration
/*cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});*/

// Use requireSignin for protected routes
router.post('/create', requireSignin, createPost);
//router.delete('/delete/:postId', requireSignin, authCtrl.canDeletePost, deletePost); // Corrected route to use post.controller.js deletePost

// Test route
//router.get("/test", userCtrl.test);
router.post("/", upload.single("profilePic"), userCtrl.create);
// General User Routes
router
  .route("/")
  .get(authCtrl.requireSignin, userCtrl.list) // List all users (requires sign-in)
  .post(upload.single("profilePic"), userCtrl.create); // Create a user with optional profile picture upload

// Update user
router.put("/update/:userId", authCtrl.requireSignin, upload.single("profilePic"), userCtrl.update);

// Routes for specific user actions
router
  .route("/:userId")
  .get(authCtrl.requireSignin, userCtrl.read) // Get user details
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, upload.single("profilePic"), userCtrl.update) // Update user
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove); // Delete user

// Route for uploading a profile picture
router.post('/uploadProfilePic', upload.single('profilePic'), async (req, res) => {
  try {
    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Update user profile with the Cloudinary image URL
    const user = await User.findByIdAndUpdate(req.user.id, { profilePic: result.secure_url }, { new: true });

    res.status(200).json({ message: 'Profile picture uploaded successfully', user });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ message: 'Error uploading image', error });
  }
});

// Follow/Unfollow routes
router.put("/follow/:userId", authCtrl.requireSignin, userCtrl.follow); // Follow by userId
router.put("/follow/username/:username", authCtrl.requireSignin, userCtrl.follow); // Follow by username
router.put("/unfollow/:userId", authCtrl.requireSignin, userCtrl.unfollow); // Unfollow by userId
router.put("/unfollow/username/:username", authCtrl.requireSignin, userCtrl.unfollow); // Unfollow by username

// Profile and Posts
router.get("/profile/:userId", authCtrl.requireSignin, userCtrl.profile); // Fetch user profile
router.get("/profile/:username", authCtrl.requireSignin, userCtrl.profile); // Fetch user profile
router.get("/:userId/posts", authCtrl.requireSignin, userCtrl.userPosts); // Fetch user posts

// Delete a specific post
router.delete("/posts/:postId", authCtrl.requireSignin, authCtrl.canDeletePost, deletePost); // Corrected route to delete post

module.exports = router;
