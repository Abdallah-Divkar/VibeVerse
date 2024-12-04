const jwt = require("jsonwebtoken");
const User = require("../models/User"); 
const jwtSecret = process.env.JWT_SECRET;

/*UserSchema.methods.authenticate = function(plainText) {
  const hashedInputPassword = this.encryptPassword(plainText);
  console.log("Hashed input password:", hashedInputPassword);  // Log the hashed input
  console.log("Stored hashed password:", this.hashed_password); // Log the stored hashed password
  return hashedInputPassword === this.hashed_password;
};
user.password = "abd@21"; // Set password directly
await user.save(); // Save user with hashed password

const isAuthenticated = user.authenticate(password);
console.log("Hashed password on sign-up:", user.hashed_password);
const token = generateJWT(user);


// Function to check if the input password matches the hashed password
async function checkPasswordMatch(userId, inputPassword) {
  try {
      // Find the user by ID (or any other identifier like email/username)
      const user = await User.findById(userId);

      if (!user) {
          return { success: false, message: 'User not found' };
      }

      // Compare the input password with the stored hashed password
      const isMatch = user.authenticate(inputPassword);  // Using the 'authenticate' method to check password

      if (isMatch) {
          return { success: true, message: 'Password matches' };
      } else {
          return { success: false, message: 'Incorrect password' };
      }
  } catch (error) {
      return { success: false, message: error.message };
  }
}

// Example usage (pass the user's id and input password)
checkPasswordMatch('674fae9ee5e5a25cdf503d53', 'abd_21')
  .then(response => console.log(response))
  .catch(error => console.error(error));*/

/**
 * Generate a JWT token for the user.
 * @param {Object} user - The user object.
 * @returns {string} - A signed JWT token.
 */
const generateJWT = (user) => {
  const payload = {
    _id: user._id,
    email: user.email,
    username: user.username,
  };

  const options = {
    expiresIn: "1d", // Token expires in 1 day
  };

  return jwt.sign(payload, jwtSecret, options);
};

/**
 * Sign in a user.
 */
const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the password matches the stored hashed password
    const isMatch = user.authenticate(password);  // Using the 'authenticate' method to check password
    
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // If password matches, generate a JWT token
    const token = generateJWT(user);

    // Set token in a cookie or return in response (you can also set HttpOnly cookies here)
    res.cookie("t", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

    // Send the user info and token as response
    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
      },
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
