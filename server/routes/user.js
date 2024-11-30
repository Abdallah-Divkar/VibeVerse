const express = require("express");
const router = express.Router();
const multer = require("multer");
const userCtrl = require("../controllers/user.controller");
const authCtrl = require("../controllers/auth.controller"); // Import auth controller
const cloudinary = require("../config/config.js").cloudinary; // Import Cloudinary config

// Set storage engine to memory for easy upload to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }); // Initialize multer with memory storage

// Middleware to handle user retrieval by ID (for route params)
router.param('userId', userCtrl.userByID);

// User routes
router.route('/')
    .get(authCtrl.requireSignin, userCtrl.list) // Get all users (requires sign-in)
    .post(upload.single('profilePic'), userCtrl.create); // Create a new user with profile picture upload

// Update user route (requires sign-in and image upload if provided)
router.put('/update', authCtrl.requireSignin, upload.single('profilePic'), userCtrl.update);

// Individual user routes with authentication middleware
router.route('/:userId')
    .get(authCtrl.requireSignin, userCtrl.read) // Get user by ID with authentication
    .put(authCtrl.requireSignin, authCtrl.hasAuthorization, upload.single('profilePic'), userCtrl.update) // Update user with profile picture
    .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove); // Delete user

// Follow/Unfollow routes (requires sign-in)
router.put('/follow/:userId', authCtrl.requireSignin, userCtrl.follow); // Follow user
router.put('/unfollow/:userId', authCtrl.requireSignin, userCtrl.unfollow); // Unfollow user

// Obtain profile
router.get('/api/users/profile/:userId', authCtrl.requireSignin, userCtrl.profile);

// Profile posts
router.get('/api/users/:userId/posts', authCtrl.requireSignin, userCtrl.userPosts);

// Delete post route
router.delete('/posts/:postId', authCtrl.requireSignin, authCtrl.canDeletePost, userCtrl.deletePost); // Delete a post (requires sign-in and authorization)

module.exports = router; // Export the router with defined routes
