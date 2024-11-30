const User = require("../models/User");

// Middleware: Retrieve user by ID
exports.userByID = async (req, res, next, id) => {
  try {
<<<<<<< HEAD
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.profile = user; // Attach user to the request
    next();
  } catch (error) {
    return res.status(500).json({ error: "Could not retrieve user" });
  }
};

// List all users
exports.list = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch users" });
=======
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
>>>>>>> 546ab6ccb475ab7290a2299402ec25af48562329
  }
};

<<<<<<< HEAD
// Create a new user
exports.create = async (req, res) => {
  try {
    const user = new User(req.body);
    if (req.file) {
      // Upload profile picture to Cloudinary
      const result = await cloudinary.uploader.upload_stream({
        resource_type: "image",
      });
      user.profilePic = result.secure_url;
    }
    await user.save();
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ error: "Could not create user" });
  }
};

// Read user details
exports.read = (req, res) => {
  req.profile.password = undefined; // Exclude sensitive information
  res.json(req.profile);
};

// Update user
exports.update = async (req, res) => {
  try {
    let user = req.profile;
    Object.assign(user, req.body); // Merge request body into user object
    if (req.file) {
      const result = await cloudinary.uploader.upload_stream({
        resource_type: "image",
      });
      user.profilePic = result.secure_url;
    }
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Could not update user" });
  }
};

// Delete user
exports.remove = async (req, res) => {
  try {
    const user = req.profile;
    await user.remove();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Could not delete user" });
  }
};

// Follow another user
exports.follow = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.body.userId,
      { $addToSet: { following: req.params.userId } },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Could not follow user" });
  }
};

// Unfollow a user
exports.unfollow = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.body.userId,
      { $pull: { following: req.params.userId } },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Could not unfollow user" });
  }
};

// Get user posts
exports.userPosts = async (req, res) => {
  try {
    const posts = await Post.find({ postedBy: req.params.userId }); // Assuming a Post model
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch user posts" });
  }
};

// Get user profile
exports.profile = (req, res) => {
  req.profile.password = undefined;
  res.json(req.profile);
};
=======
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
>>>>>>> 546ab6ccb475ab7290a2299402ec25af48562329
