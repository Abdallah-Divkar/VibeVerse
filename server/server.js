const express = require("express");
const cors = require("cors");
const axios = require('axios');
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const bodyParser = require('body-parser');
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const authRoutes = require("./routes/auth.routes");
const cmtRoutes = require("./routes/comment");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware Setup
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use(express.json()); // Parse incoming requests with JSON payloads
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// Handle preflight requests (OPTIONS) explicitly
//app.options('*', cors(corsOptions)); // Allow preflight requests for all routes

//app.use(withAuth());  // Ensure authentication middleware is applied globally

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database connected successfully!"))
  .catch((err) => console.error("Database connection error:", err));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", cmtRoutes);
app.use("/api/auth", authRoutes);

// Example: Protect specific routes with Clerk middleware
/*app.use("/api/protected", requireAuth(), (req, res) => {
  console.log("Authenticated user:", req.auth);  // Log the req.auth object
  res.send(`Hello, authenticated user with ID: ${req.auth.userId}`);
});*/

/*app.get("/api/users/currentUser", requireAuth(), (req, res) => {
  const currentUser = req.auth;  // Access current user information
  console.log("Current User:", currentUser);  // Log the user data
  res.json(currentUser);  // Return the user data as JSON
});*/

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Error handling middleware (use after all routes)
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ "error": `${err.name}: ${err.message}` });
  }
  if (err) {
    console.error(err);
    return res.status(400).json({ "error": `${err.name}: ${err.message}` });
  }
  next();
});

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
