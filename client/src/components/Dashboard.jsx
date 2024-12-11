import React, { useState, useEffect } from "react";
import { Box, Avatar, Typography, Button, TextField, Container } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Dashboard.css";
import { useAuth } from "../context/AuthContext";

const backendURL = import.meta.env.VITE_BACKEND_URL;

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bio, setBio] = useState("No bio available");
  const [editingBio, setEditingBio] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newProfilePic, setNewProfilePic] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("User:", user); // Log the user to verify it's being set
    if (!user?.token || !user?.id) {
      navigate("/signin"); // Redirect if no user or token
      return;
    }
    fetchUserData(user.id);
    fetchPosts(user.id);
  }, [user?.token, user?.id, navigate]);
  

  const fetchUserData = async (userId) => {
    const token = user?.token || localStorage.getItem('token');
    if (!token) {
      toast.error("User token is missing.");
      navigate("/signin");
      return;
    }

    try {
      const userRes = await axios.get(`${backendURL}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userData = userRes.data;

      setProfile({
        name: userData.firstName || "Anonymous User",
        username: userData.username,
        email: userData.emailAddresses?.[0]?.emailAddress || "No Email Available",
        profilePic: userData.profileImageUrl || "default-profile.png",
      });

      setBio(userData.bio || "No bio available");
      setFollowerCount(userData.followers.length); // Assuming followers is an array
      setFollowingCount(userData.following.length); // Assuming following is an array
    } catch (err) {
      console.error("Error fetching user data:", err);
      toast.error("Error fetching user data.");
    }
  };

  const fetchPosts = async (userId) => {
    try {
      const response = await axios.get(`${backendURL}/api/users/${userId}/posts`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      if (Array.isArray(response.data.posts)) {
        setPosts(response.data.posts);
      } else {
        toast.error("Failed to load posts.");
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
      toast.error("Error fetching posts.");
    } finally {
      setLoading(false);  // Set loading to false after data is fetched
    }
  };

  const handleBioUpdate = async () => {
    if (!bio.trim()) return toast.error("Bio cannot be empty.");
    
    try {
      const response = await axios.put(
        `${backendURL}/api/users/${user.id}`,
        { bio },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      toast.success("Bio updated successfully!");
      setEditingBio(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update bio.");
    }
  }; 

  const handleProfileUpdate = async () => {
    try {
      if (!user?.token) {
        toast.error("User token is missing.");
        return;
      }

      const updatedProfileData = {
        username: newUsername || profile?.username,
        email: newEmail || profile?.email,
        profilePic: newProfilePic || profile?.profilePic
      };

      const response = await axios.put(
        `${backendURL}/api/users/${user.id}`,
        updatedProfileData,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      if (response?.data) {
        toast.success("Profile updated successfully!");
        setProfile((prevProfile) => ({
          ...prevProfile,
          username: newUsername || prevProfile.username,
          email: newEmail || prevProfile.email,
          profilePic: newProfilePic || prevProfile.profilePic,
        }));
        setIsEditingProfile(false);
      } else {
        toast.error("Profile update failed. Please try again.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Unable to update profile.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  // Handle loading state and ensure profile is fetched before rendering
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>Error loading profile.</div>;
  }

  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {profile?.name || "User"}!
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", marginBottom: 3 }}>
        <Avatar
          alt="Profile Picture"
          src={profile?.profilePic}
          sx={{ width: 120, height: 120, marginRight: 2 }}
        />
        <Box>
          <Typography variant="body1" gutterBottom>
            <strong>Email:</strong> {profile?.email}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Bio:</strong>
          </Typography>
          {editingBio ? (
            <Box>
              <TextField
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                multiline
                fullWidth
                rows={4}
                variant="outlined"
                sx={{ marginBottom: 2 }}
              />
              <Button variant="contained" color="primary" onClick={handleBioUpdate}>
                Save
              </Button>
            </Box>
          ) : (
            <Box>
              <Typography variant="body2">{bio}</Typography>
              <Button variant="outlined" color="primary" onClick={() => setEditingBio(true)}>
                Edit Bio
              </Button>
            </Box>
          )}
          <Typography variant="body1" gutterBottom>
            <strong>Followers:</strong> {followerCount}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Following:</strong> {followingCount}
          </Typography>

          <Button
            variant="outlined"
            color="primary"
            onClick={() => setIsEditingProfile(true)}
          >
            Edit Profile
          </Button>
        </Box>
      </Box>

      {isEditingProfile && (
        <Box sx={{ marginBottom: 3 }}>
          <Typography variant="h6" gutterBottom>
            Edit Profile
          </Typography>
          <TextField
            label="Username"
            value={newUsername || profile?.username}
            onChange={(e) => setNewUsername(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Email"
            value={newEmail || profile?.email}
            onChange={(e) => setNewEmail(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Profile Picture URL"
            value={newProfilePic || profile?.profilePic}
            onChange={(e) => setNewProfilePic(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{ marginBottom: 2 }}
          />
          <Button variant="contained" color="primary" onClick={handleProfileUpdate}>
            Save Changes
          </Button>
        </Box>
      )}

      <Button variant="contained" color="secondary" onClick={handleLogout}>
        Logout
      </Button>

      <Box sx={{ marginBottom: 3 }}>
        <Typography variant="h5" gutterBottom>
          Create a New Post
        </Typography>
        <TextField
          placeholder="What's on your mind?"
          multiline
          rows={3}
          fullWidth
          variant="outlined"
          sx={{ marginBottom: 2 }}
        />
        <Button variant="contained" color="primary">
          Post
        </Button>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          User Posts
        </Typography>
        {posts.map((post) => (
          <Box key={post._id} sx={{ marginBottom: 2 }}>
            <Typography variant="body1">{post.content}</Typography>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default Dashboard;
