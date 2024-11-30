const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user.controller"); // Import the user controller

// Test route to check if the controller is working
router.get("/test", userCtrl.test);

// Add more routes as needed (example: list all users)
router.get("/", userCtrl.list);

module.exports = router; // Export the router