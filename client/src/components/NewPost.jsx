import React, { useState } from "react";
import axios from "axios";
import axiosInstance from "../api/axiosInstance";
import { Button, TextField, Typography, Box } from "@mui/material";
import { toast } from "react-toastify"; // For notifications
import "react-toastify/dist/ReactToastify.css";

//const backendURL = import.meta.env.VITE_BACKEND_URL;
const backendURL = "http://localhost:3000";

const NewPost = () => {
  const [caption, setCaption] = useState("");
  const [media, setMedia] = useState(null); // Image or video
  const [mediaType, setMediaType] = useState(null); // Track media type (image/video)
  const [loading, setLoading] = useState(false);

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type and set media type accordingly
      const fileType = file.type.split("/")[0]; // Get the type (image or video)
      setMedia(file);
      setMediaType(fileType);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
  
    if (!caption.trim()) {
      toast.error("Caption cannot be empty.");
      return;
    }
    if (!media) {
      toast.error("Please select an image or video.");
      return;
    }
  
    const formData = new FormData();
    formData.append("content", caption);
    formData.append("photo", media);
  
    const token = localStorage.getItem("authToken");
    console.log("Retrieved Token:", token);
  
    if (!token) {
      toast.error("Authentication token is missing. Please log in again.");
      return;
    }
  
    setLoading(true); // Set loading to true before making the request
  
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };
  
      const response = await axiosInstance.post("/posts/create", formData, config);
      if (response.status === 201) {
        toast.success("Post created successfully!");
        setCaption(""); // Reset the caption field
        setMedia(null); // Reset media
        setMediaType(null); // Reset media type
      } else {
        toast.error(response.data.message || "Failed to create post.");
      }
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      toast.error("An error occurred while creating the post.");
    } finally {
      setLoading(false); // Set loading to false after the request is finished
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "0 auto", padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Create a New Post
      </Typography>

      <form onSubmit={handlePostSubmit}>
        {/* Caption Field */}
        <TextField
          label="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          fullWidth
          multiline
          rows={4}
          margin="normal"
        />

        {/* File input for image/video */}
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleMediaChange}
          style={{ margin: "10px 0" }}
        />

        {/* Show preview of selected media */}
        {media && (
          <Box sx={{ marginTop: 2, textAlign: "center" }}>
            {mediaType === "image" ? (
              <img
                src={URL.createObjectURL(media)}
                alt="preview"
                style={{ maxWidth: "100%", maxHeight: "300px" }}
              />
            ) : mediaType === "video" ? (
              <video controls style={{ maxWidth: "100%", maxHeight: "300px" }}>
                <source src={URL.createObjectURL(media)} type={media.type} />
              </video>
            ) : null}
          </Box>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ marginTop: 2 }}
        >
          {loading ? "Creating Post..." : "Post"}
        </Button>
      </form>
    </Box>
  );
};

export default NewPost;
