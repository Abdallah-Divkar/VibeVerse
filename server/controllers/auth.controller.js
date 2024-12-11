const jwt = require("jsonwebtoken");
const User = require("../models/User"); 
const Post = require("../models/Post");
const jwtSecret = process.env.JWT_SECRET;
const generateJWT = require("../middleware/jwtUtil");

/**
 * Sign up a new user.
 */
const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("Error during signup:", err);
    return res.status(500).json({ error: "Error during signup" });
  }
};

/**
 * Sign in a user.
 */
const signin = async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  try {
    // Check if the input is either a username or email
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    // Check if the password is correct
    if (!user.authenticate(password)) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send response with token
    res.json({
      success: true,
      token,
      user: {
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
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
  signup,
  signin,
  signout,
  requireSignin,
  hasAuthorization,
  canDeletePost,
};
