const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller'); 

router.post('/signup', authCtrl.signup);

// Route to sign in a user
router.post('/signin', authCtrl.signin);

// Route to sign out a user
router.post('/auth/signout', authCtrl.signout);

module.exports = router;
