const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');  // Correctly import the controller

// Route to sign in a user
router.post('/auth/signin', authCtrl.signin);

// Route to sign out a user
router.post('/auth/signout', authCtrl.signout);

module.exports = router;  // Export the router with defined routes

<<<<<<< HEAD
exports.signin = (req, res) => {
    const { email, password } = req.body;
  
    // Simulate authentication (replace with actual logic)
    if (email === "test@example.com" && password === "password123") {
      return res.json({ message: "Signin successful", user: { email } });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  };
  
  exports.signout = (req, res) => {
    // Simulate signout (e.g., clear tokens, destroy sessions)
    return res.json({ message: "Signout successful" });
  };
=======


>>>>>>> 546ab6ccb475ab7290a2299402ec25af48562329
