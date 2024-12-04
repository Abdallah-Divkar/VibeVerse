const express = require('express');
const router = express.Router();
const {     createComment, getAllComments, getCommentById, getCommentsByUser, getCommentsByPost, deleteComment } = require('../controllers/comment.controller');
const authenticate = require("../middleware/authenticate");

// Route to create a comment
router.post('/', authenticate, createComment);

//get all
router.get('/', getAllComments); // Route to get all comments

//ghet by id
router.get('/:id', getCommentById); // Route to get a comment by its ID

//get by user
router.get('/user/:userId', getCommentsByUser); // Route to get comments by user

//get by post
router.get('/post/:postId', getCommentsByPost); // Route to get comments by post

// Route to delete a comment
router.delete('/:id', authenticate, deleteComment);

module.exports = router;
