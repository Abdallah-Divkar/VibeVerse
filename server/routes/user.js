const express = require("express");
const { createPost, deletePost } = require("../controllers/post.controller");
const router = express.Router();
const userCtrl = require("../controllers/user.controller");
const postCtrl = require("../controllers/post.controller");
const upload = require("../middleware/upload");
const cloudinary = require('../config/config');
const User = require('../models/User');
const Post = require('../models/Post');
const fs = require('fs');
const { requireAuth } = require('@clerk/express');

// Use requireAuth for protected routes
router.post('/create', requireAuth, createPost);
router.delete('/delete/:postId', requireAuth, postCtrl.deletePost); 

router.post("/", upload.single("profilePic"), userCtrl.create);
router.post('/updateProfile', requireAuth, userCtrl.updateProfile);

router
  .route("/")
  .get(requireAuth, userCtrl.list)
  .post(upload.single("profilePic"), userCtrl.create);

router.put("/update/:userId", requireAuth, upload.single("profilePic"), userCtrl.update);

router
  .route("/:userId")
  .get(requireAuth, userCtrl.read)
  .put(requireAuth, userCtrl.update)
  .delete(requireAuth, userCtrl.remove);

router.post('/uploadProfilePic', upload.single('profilePic'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    const user = await User.findByIdAndUpdate(req.auth.userId, { profilePic: result.secure_url }, { new: true });

    res.status(200).json({ message: 'Profile picture uploaded successfully', user });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ message: 'Error uploading image', error });
  }
});

router.put("/follow/:userId", requireAuth, userCtrl.follow);
router.put("/unfollow/:userId", requireAuth, userCtrl.unfollow);

router.get("/profile/:userId", requireAuth, userCtrl.profile);
router.get("/:userId/posts", requireAuth, userCtrl.userPosts);

module.exports = router;
