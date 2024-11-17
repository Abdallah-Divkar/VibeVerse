const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
<<<<<<< HEAD
  content: { type: String, required: true },
  likes: { type: [String], default: [] },
  comments: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
=======
    caption: String,
    profile: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [
        {
            commenter: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            text: String,
            timestamp: { type: Date, default: Date.now }
        }
    ],
    picture: String, // Field to store the URL of the image
    createdAt: { type: Date, default: Date.now }
>>>>>>> bc1eee9fed92c3f787f7f1477873f8fef53d27d1
});

module.exports = mongoose.model('Post', postSchema);