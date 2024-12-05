const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const authRoutes = require("./routes/auth.routes");
const cmtRoutes = require("./routes/comment");
const { requireAuth } = require("@clerk/express");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

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
app.use("/api/protected", requireAuth, (req, res) => {
  res.send(`Hello, authenticated user with ID: ${req.auth.userId}`);
});

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
