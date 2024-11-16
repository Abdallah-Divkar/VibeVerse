const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
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
});

module.exports = mongoose.model("Post", postSchema);
