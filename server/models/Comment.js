const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },       // Use 'text' instead of 'content'
  createAt: { type: Date, required: true }      // Use 'createAt' as per your JSON
});

module.exports = mongoose.model('Comment', commentSchema);