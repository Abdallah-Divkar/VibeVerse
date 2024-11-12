const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB (update with your actual connection string)
mongoose.connect('mongodb://localhost/social-media-db', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Routes (you'll define these later)
app.get('/', (req, res) => {
  res.send('Welcome to the Social Media App');
});

// Server listening
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
