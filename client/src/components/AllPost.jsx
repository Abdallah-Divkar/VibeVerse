import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Box, Typography, Button, TextField, Avatar, IconButton, CircularProgress, Modal } from "@mui/material";
import { Favorite, FavoriteBorder, Comment } from "@mui/icons-material";
import { toast } from "react-toastify";
const backendURL = import.meta.env.REACT_APP_BACKEND_URL;
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../api/axiosInstance";

const AllPost = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState(""); // For new comment
  const [page, setPage] = useState(1);
  const [editingPost, setEditingPost] = useState(null);
  const observer = useRef();

  const fetchPosts = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const res = await axiosInstance.get(`/posts?page=${page}`);
      const fetchedPosts = res.data;

      if (fetchedPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...fetchedPosts]);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
      toast.error("Failed to fetch posts.");
    } finally {
      setLoading(false);
    }
  };

  const lastPostRef = useRef();
  useEffect(() => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        fetchPosts();
      }
    });
    if (lastPostRef.current) observer.current.observe(lastPostRef.current);
  }, [loading, hasMore]);

  // Like and comment handlers
  const handleLike = async (postId, isLiked) => {
    try {
      const res = isLiked
        ? await axiosInstance.post(`/posts/${postId}/unlike`)
        : await axiosInstance.post(`/posts/${postId}/like`);
      const updatedPost = res.data;
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === postId ? updatedPost : post))
      );
    } catch (err) {
      console.error("Error liking/unliking post:", err);
      toast.error("Failed to update like.");
    }
  };

  const handleComment = async (postId) => {
    if (!commentText.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }
    try {
      const res = await axiosInstance.post(`/posts/${postId}/comment`, { content: commentText });
      const updatedPost = res.data;
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === postId ? updatedPost : post))
      );
      setCommentText(""); // Reset the comment field
      toast.success("Comment added!");
    } catch (err) {
      console.error("Error adding comment:", err);
      toast.error("Failed to add comment.");
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
  };

  const saveEdit = async () => {
    try {
      const res = await axiosInstance.put(`/posts/${editingPost._id}`, {
        title: editingPost.title,
        content: editingPost.content,
      });
      const updatedPost = res.data;
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === editingPost._id ? updatedPost : post))
      );
      toast.success("Post updated successfully!");
      setEditingPost(null);
    } catch (err) {
      console.error("Error updating post:", err);
      toast.error("Failed to update post.");
    }
  };

  return (
    <Box sx={{ margin: 4 }}>
      <Typography variant="h4" gutterBottom>
        All Posts
      </Typography>

      {posts.map((post, index) => (
        <Box
          key={post._id}
          ref={index === posts.length - 1 ? lastPostRef : null}
          sx={{
            border: "1px solid #ddd",
            borderRadius: 2,
            padding: 2,
            marginBottom: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
            <Avatar src={post.author.profilePic} alt={post.author.username} />
            <Typography variant="h6" sx={{ marginLeft: 2 }}>
              {post.author.username}
            </Typography>
          </Box>

          <Typography variant="h5">{post.title}</Typography>
          <Typography variant="body1" sx={{ marginY: 2 }}>
            {post.content}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box>
              <IconButton
                onClick={() => handleLike(post._id, post.isLikedByCurrentUser)}
                color={post.isLikedByCurrentUser ? "error" : "default"}
              >
                {post.isLikedByCurrentUser ? <Favorite /> : <FavoriteBorder />}
              </IconButton>
              <Typography variant="body2" sx={{ display: "inline" }}>
                {post.likesCount} Likes
              </Typography>
            </Box>
            <Typography variant="body2">{post.commentsCount} Comments</Typography>
          </Box>

          {/* Add a Comment */}
          <Box sx={{ marginTop: 2 }}>
            <TextField
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
              sx={{ marginBottom: 1 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleComment(post._id)}
            >
              Comment
            </Button>
          </Box>

          {/* Display Comments */}
          {post.comments && post.comments.length > 0 && (
            <Box sx={{ marginTop: 2 }}>
              <Typography variant="subtitle1">Comments:</Typography>
              {post.comments.map((comment) => (
                <Box
                  key={comment._id}
                  sx={{
                    marginTop: 1,
                    padding: 1,
                    border: "1px solid #ddd",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body2">
                    <strong>{comment.author.username}:</strong> {comment.content}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      ))}

      {loading && <CircularProgress sx={{ display: "block", margin: "auto", marginTop: 2 }} />}
      {!hasMore && <Typography variant="body2" align="center">No more posts to load.</Typography>}

      {/* Edit Post Modal */}
      {editingPost && (
        <Modal open={true} onClose={() => setEditingPost(null)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Edit Post
            </Typography>
            <TextField
              fullWidth
              label="Title"
              value={editingPost.title}
              onChange={(e) =>
                setEditingPost((prev) => ({ ...prev, title: e.target.value }))
              }
              sx={{ marginBottom: 2 }}
            />
            <TextField
              fullWidth
              label="Content"
              multiline
              rows={4}
              value={editingPost.content}
              onChange={(e) =>
                setEditingPost((prev) => ({ ...prev, content: e.target.value }))
              }
              sx={{ marginBottom: 2 }}
            />
            <Button variant="contained" color="primary" onClick={saveEdit}>
              Save
            </Button>
          </Box>
        </Modal>
      )}
    </Box>
  );
};

export default AllPost;
