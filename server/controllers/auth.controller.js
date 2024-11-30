const User = require('../models/User.js');
const jwt = require('jsonwebtoken');
const { expressjwt } = require('express-jwt');
const config = require('../config/config.js');

// Ensure process.env.JWT_SECRET and config.jwtSecret match
const jwtSecret = process.env.JWT_SECRET || config.jwtSecret;

// Signin function
const signin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ error: "User with that email does not exist" });
    
    // Check password
    if (!user.authenticate(req.body.password)) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // Generate JWT token
    const token = jwt.sign({ _id: user._id }, jwtSecret, { expiresIn: '1d' }); // Token expires in 1 day
    console.log("Generated Token:", token);

    // Set cookie with the token
    res.cookie('t', token, { expire: new Date() + 9999 });

    // Return token and user details
    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Could not sign in" });
  }
};

// Signout function
const signout = (req, res) => {
  res.clearCookie("t");
  return res.status(200).json({ message: "Signed out successfully" });
};

// Middleware to require sign-in (JWT verification)
const requireSignin = expressjwt({
  secret: jwtSecret,
  algorithms: ["HS256"],
  userProperty: 'user' // Attach decoded JWT payload to req.user
});

// Authorization check middleware
const hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!authorized) {
    return res.status(403).json({ error: "User is not authorized" });
  }
  next();
};

// Middleware to ensure only authenticated users can delete posts
const canDeletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) return res.status(404).json({ error: "Post not found" });

    // Check if the user is the owner of the post
    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized to delete this post" });
    }

    next(); // User is authorized to delete the post
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "An error occurred while verifying post ownership" });
  }
};

module.exports = { signin, signout, requireSignin, hasAuthorization, canDeletePost };
