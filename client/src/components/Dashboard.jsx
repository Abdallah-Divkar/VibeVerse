import React, { useState } from "react";
import { Container, Box, Avatar, Typography, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Navbar"; // Your Navbar component
import { useAuth } from "../context/AuthContext"; // Custom AuthContext for user info

const backendURL = import.meta.env.VITE_BACKEND_URL;

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Access user data from AuthContext
  const [bio, setBio] = useState(user?.bio || "No bio available"); // Default bio if user doesn't have one
  const [loading, setLoading] = useState(false);

  // Handle bio update
  const handleBioUpdate = async () => {
    if (!bio.trim()) {
      toast.error("Bio cannot be empty.");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `${backendURL}/api/users/${user._id}`,
        { bio },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Bio updated successfully!");
    } catch (err) {
      toast.error("Failed to update bio.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  if (!user) {
    return <CircularProgress sx={{ display: 'block', margin: 'auto', marginTop: 5 }} />;
  }

  return (
    <Container sx={{ marginTop: 4 }}>
      {/* Welcome Message */}
      <Typography variant="h4" gutterBottom align="center">
        Welcome, {user.name}!
      </Typography>

      <Box sx={{ textAlign: "center" }}>
        {/* Profile Info */}
        <Avatar
          alt="Profile Picture"
          src={user.profilePic || "/default-avatar.png"} // Fallback to default image if profilePic doesn't exist
          sx={{ width: 120, height: 120, marginBottom: 2, marginX: "auto" }}
        />
        <Typography variant="h6">{user.username}</Typography>
        <Typography variant="body1">{user.email}</Typography>

        <Box sx={{ marginTop: 3 }}>
          <Typography variant="body1">
            <strong>Bio:</strong> {bio}
          </Typography>
          <Button variant="outlined" color="primary" onClick={handleBioUpdate} sx={{ marginTop: 2 }}>
            Update Bio
          </Button>

          <Typography variant="body1" sx={{ marginTop: 2 }}>
            <strong>Followers:</strong> {user.followers?.length || 0} | <strong>Following:</strong> {user.following?.length || 0}
          </Typography>
        </Box>

        {/* Posts Section */}
        <Box sx={{ marginTop: 3 }}>
          <Typography variant="h5" gutterBottom>
            Your Posts
          </Typography>
          {user.posts?.length > 0 ? (
            user.posts.map((post) => (
              <Box key={post._id} sx={{ marginBottom: 2 }}>
                <Typography variant="body1">{post.content}</Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2">No posts yet. Start creating posts!</Typography>
          )}
        </Box>

        {/* Bottom Navbar */}
        <Box sx={{ marginTop: 4 }}>
          <Button variant="contained" color="primary" sx={{ marginRight: 2 }} onClick={() => navigate("/createpost")}>
            Create Post
          </Button>
          <Button variant="contained" color="secondary" sx={{ marginRight: 2 }} onClick={() => navigate("/profile/edit")}>
            Edit Profile
          </Button>
          <Button variant="contained" color="default" onClick={() => navigate("/users")}>
            View Users
          </Button>
        </Box>

        <Box sx={{ marginTop: 3 }}>
          <Button variant="contained" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;
