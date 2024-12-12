const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user.controller");
const { getUserProfile } = userCtrl;
const { requireAuth } = require("../middleware/requireAuth");
const upload = require("../middleware/upload");
const User = require('../models/User');

// User Profile Routes
router.get("/me", requireAuth, getUserProfile);
router.get("/:username", getUserProfile);
router.get("/profile/:userId", requireAuth, getUserProfile);
router.get('/currentUser', requireAuth, async (req, res) => {
  try {
    const userId = req.auth.userId;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    console.log("User ID:", req.auth.userId);
    const user = await User.findById(userId).select('-password');
    console.log("User Found:", user);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user", error });
  }
});

// Search Users
router.get('/search', async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) {
      return res.status(400).json({ success: false, message: 'Query is required' });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { name: { $regex: query, $options: 'i' } },
      ],
    }).limit(10); // Limit to 10 results

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ success: false, message: 'Error searching users' });
  }
});

// User CRUD Operations
router
  .route("/")
  .get(requireAuth, userCtrl.list) // List all users
  .post(upload, userCtrl.create); // Create a new user

router.put("/update/:userId", requireAuth, upload, userCtrl.update); // Update user profile

router
  .route("/:userId")
  .get(requireAuth, userCtrl.read) // Get user by ID
  .put(requireAuth, userCtrl.update) // Update user by ID
  .delete(requireAuth, userCtrl.remove); // Delete user by ID

// User Profile Pic Upload
router.post('/uploadProfilePic', upload, async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    const user = await User.findByIdAndUpdate(
      req.auth.userId,
      { profilePic: result.secure_url }, // Save the Cloudinary URL to the profilePic field
      { new: true }
    );
    res.status(200).json({ message: 'Profile picture uploaded successfully', user });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ message: 'Error uploading image', error });
  }
});

// Follow/Unfollow Routes
router.put("/follow/:userId", requireAuth, userCtrl.follow);
router.put("/unfollow/:userId", requireAuth, userCtrl.unfollow);

// User Stats Route
router.get("/:userId/stats", requireAuth, userCtrl.getUserStats); // Get user stats

module.exports = router;
