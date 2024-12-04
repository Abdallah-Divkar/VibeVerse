const jwt = require("jsonwebtoken");
const User = require("../models/User"); 
const Post = require("../models/Post");
const jwtSecret = process.env.JWT_SECRET;
const generateJWT = require("../middleware/jwtUtil");

/**
 * Sign in a user.
 */
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Use the authenticate method to check if the password matches
    const isPasswordValid = user.authenticate(password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '3d' }
    );

    return res.json({
      message: 'Login successful',
      user,
      token
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error during sign-in" });
  }
};


/**
 * Sign out a user.
 */
const signout = (req, res) => {
  res.clearCookie("t");
  return res.json({ message: "Signed out successfully" });
};

/**
 * Middleware to require sign-in (JWT verification).
 */
const requireSignin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

/**
 * Authorization check middleware.
 */
const hasAuthorization = (req, res, next) => {
  const authorized =
    req.profile && req.user && req.profile._id.toString() === req.user._id;
  if (!authorized) {
    return res.status(403).json({ error: "User is not authorized" });
  }
  next();
};

/**
 * Middleware to ensure only authenticated users can delete posts.
 */
const canDeletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId); // Ensure Post model is imported

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the user is the owner of the post
    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized to delete this post" });
    }

    next(); // User is authorized to delete the post
  } catch (err) {
    console.error("Error during post authorization:", err);
    return res.status(500).json({ error: "An error occurred during authorization" });
  }
};

module.exports = {
  signin,
  signout,
  requireSignin,
  hasAuthorization,
  canDeletePost,
};
