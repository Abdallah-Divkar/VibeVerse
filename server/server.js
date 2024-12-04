const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
require("dotenv").config();
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const authRoutes = require("./routes/auth.routes");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json()); // Built-in middleware for parsing JSON
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Connect to MongoDB
const dbURI = process.env.MONGO_URI;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Database connected successfully!');
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });

// Routes
app.use("/api/users", userRoutes); 
app.use("/api/posts", postRoutes);
app.use('/api', authRoutes);


// Test route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
