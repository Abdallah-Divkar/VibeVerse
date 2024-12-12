import React, { useState, useEffect } from "react";
import { Container, Box, Avatar, Typography, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Navbar"; // Your Navbar component
import { useAuth } from "../context/AuthContext"; // Custom AuthContext for user info

const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Access user data from AuthContext
  const [bio, setBio] = useState(user?.bio || "No bio available");
  const [posts, setPosts] = useState([]); // State for posts
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.bio) setBio(user.bio);
  }, [user]);
  
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    console.log("User ID:", userId);
  }, []);
  

  // Fetch posts only when user is available and has _id
  useEffect(() => {
    console.log("User before fetching posts:", user);
    if (user?._id) {
      const fetchPosts = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`${backendURL}/api/posts/users/${user._id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          setPosts(response.data.posts);
        } catch (err) {
          toast.error("Failed to fetch posts.");
        } finally {
          setLoading(false);
        }
      };
      fetchPosts();
    }
  }, [user]);  
  
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
    return <CircularProgress sx={{ display: "block", margin: "auto", marginTop: 5 }} />;
  }

  if (loading) {
    return <CircularProgress sx={{ display: "block", margin: "auto", marginTop: 5 }} />;
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
          {loading ? (
            <CircularProgress sx={{ display: 'block', margin: 'auto', marginTop: 5 }} />
          ) : (
            posts.length > 0 ? (
              posts.map((post) => (
                <Box key={post._id} sx={{ marginBottom: 2 }}>
                  <Typography variant="body1">{post.content}</Typography>
                  {post.photo && <img src={post.photo} alt="Post" style={{ maxWidth: "100%", marginTop: "10px" }} />}
                  <Box sx={{ display: "flex", alignItems: "center", marginTop: 2 }}>
                    <Avatar
                      alt={post.user.username}
                      src={post.user.profilePic || "/default-avatar.png"}
                      sx={{ width: 30, height: 30, marginRight: 2 }}
                    />
                    <Typography variant="body2">{post.user.username}</Typography>
                  </Box>
                </Box>
              ))
            ) : (
              <Typography variant="body2">No posts yet. Start creating posts!</Typography>
            )
          )}
        </Box>

        {/* Bottom Navbar */}
        {/* Add your bottom navigation bar here */}
      </Box>
    </Container>
  );
};

export default Dashboard;
