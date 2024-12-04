const Comment = require('../models/Comment');

//Create a comment (for completeness)
const createComment = async (req, res) => {
    try {
      const { text, postId } = req.body;
  
      if (!text || !postId) {
        return res.status(400).json({ message: 'Text and Post ID are required' });
      }
  
      // Check if req.user is set
      if (!req.user) {
        return res.status(400).json({ message: 'User not authenticated' });
      }
  
      const newComment = new Comment({
        text,
        post: postId,
        user: req.user.id, // The user ID should be available now
      });
  
      const savedComment = await newComment.save();
      res.status(201).json(savedComment);
    } catch (error) {
      console.error('Error creating comment:', error);
      res.status(500).json({ message: 'Server error' });
    }
};

//getting all comments
const getAllComments = async (req, res) => {
    try {
      const comments = await Comment.find().populate('user', 'username'); // Populating the user field with username
      res.status(200).json(comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ message: 'Server error' });
    }
};

// Get a comment by its ID
const getCommentById = async (req, res) => {
    try {
      const commentId = req.params.id;
      const comment = await Comment.findById(commentId).populate('user', 'username'); // Optionally populate user data
  
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      res.status(200).json(comment);
    } catch (error) {
      console.error('Error fetching comment by ID:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  
//Getting comments by user
const getCommentsByUser = async (req, res) => {
    try {
      const userId = req.params.userId;
      const comments = await Comment.find({ user: userId }).populate('post', 'text'); // Populate post details if necessary
      res.status(200).json(comments);
    } catch (error) {
      console.error('Error fetching comments by user:', error);
      res.status(500).json({ message: 'Server error' });
    }
};

//Getting Comments by post
const getCommentsByPost = async (req, res) => {
    try {
      const postId = req.params.postId;
      const comments = await Comment.find({ post: postId }).populate('user', 'username'); // Populate user details if necessary
      res.status(200).json(comments);
    } catch (error) {
      console.error('Error fetching comments by post:', error);
      res.status(500).json({ message: 'Server error' });
    }
};
  
// Delete a comment by its ID
const deleteComment = async (req, res) => {
    try {
      const commentId = req.params.id;
      const comment = await Comment.findByIdAndDelete(commentId);
  
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
      console.error('Error deleting comment:', error);
      res.status(500).json({ message: 'Server error' });
    }
};
    

  
  
module.exports = {
    createComment,
    getAllComments,
    getCommentById,
    getCommentsByUser,
    getCommentsByPost,
    deleteComment
};
  