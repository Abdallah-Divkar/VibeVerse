const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },       
  createdAt: { type: Date, default: Date.now }, 
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Reference to the user who created the comment
});

module.exports = mongoose.model('Comment', commentSchema);
