const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema(
  {
    content: { type: String, required: true },
    photo: { type: String, required: true }, // URL of the photo
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
