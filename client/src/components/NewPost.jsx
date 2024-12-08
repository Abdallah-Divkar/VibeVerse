import React, { useState } from "react";
import axios from "axios";
const backendURL = import.meta.env.REACT_APP_BACKEND_URL;
import { toast } from "react-toastify";
import { TextField, Button, Typography, Box, Container, CircularProgress } from "@mui/material";

const NewPost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "your_upload_preset"); // Replace with your Cloudinary preset

    try {
      const res = await axios.post(`${backendURL}/https://api.cloudinary.com/v1_1/your_cloud_name/image/upload`, formData);
      return res.data.secure_url; // Return the uploaded image URL
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image.");
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = null;
      if (image) {
        imageUrl = await uploadImage(image);
        if (!imageUrl) throw new Error("Image upload failed");
      }

      const response = await axios.post(`${backendURL}/api/posts`, { title, content, image: imageUrl });
      toast.success("Post created successfully!");
      setTitle("");
      setContent("");
      setImage(null);
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post.");
    }

    setLoading(false);
  };

  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create a New Post
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ marginBottom: 2 }}>
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Box>
        <Box sx={{ marginBottom: 2 }}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </Box>
        <Box sx={{ marginBottom: 2 }}>
          <TextField
            label="Content"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ padding: "10px 20px" }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Submit Post"}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default NewPost;
