import React, { useState, useEffect } from "react";
import { useUser, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Box, Avatar, Typography, Button, TextField, Container } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Dashboard.css";

const Dashboard = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bio, setBio] = useState("No bio available");
  const [editingBio, setEditingBio] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      fetchUserData(user.id);
      fetchPosts(user.id);
    }
  }, [isLoaded, isSignedIn, user]);

  const fetchUserData = async (userId) => {
    try {
      const statsRes = await axios.get(`/api/users/${userId}/stats`);
      setFollowerCount(statsRes.data.followerCount || 0);
      setFollowingCount(statsRes.data.followingCount || 0);

      setProfile({
        name: user.firstName || "Anonymous User",
        email: user.emailAddresses?.[0]?.emailAddress || "No Email Available",
        profilePic: user.profileImageUrl || "default-profile.png",
      });

      setBio(user.publicMetadata?.bio || "No bio available");
      setLoading(false);
    } catch (err) {
      console.error("Error fetching user data:", err);
      toast.error("Error fetching user data.");
      setLoading(false);
    }
  };

  const fetchPosts = async (userId) => {
    try {
      const response = await axios.get(`/api/users/${userId}/posts`);
      if (Array.isArray(response.data.posts)) {
        setPosts(response.data.posts);
      } else {
        toast.error("Failed to load posts.");
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
      toast.error("Error fetching posts.");
    }
  };

  const handleBioUpdate = async () => {
    try {
      await user.update({ publicMetadata: { bio } });
      toast.success("Bio updated successfully!");
      setEditingBio(false);
    } catch (err) {
      console.error("Error updating bio:", err);
      toast.error("Unable to update bio.");
    }
  };

  if (!isLoaded || !isSignedIn) {
    return <div>Loading user data...</div>;
  }

  return (
    <Container sx={{ marginTop: 4 }}>
      <SignedIn>
        <Typography variant="h4" gutterBottom>
          Welcome, {profile?.name || "User"}!
        </Typography>

        {/* Profile Section */}
        <Box sx={{ display: "flex", alignItems: "center", marginBottom: 3 }}>
          <Avatar
            alt="Profile Picture"
            src={profile?.profilePic}
            sx={{ width: 120, height: 120, marginRight: 2 }}
          />
          <Box>
            <Typography variant="body1" gutterBottom>
              <strong>Email:</strong> {profile?.email}
              <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate("/edit-profile")}
            >
              Edit Profile
            </Button>
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
          </Box>
        </Box>

        {/* Post Creation Section */}
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
          <Button variant="contained" color="primary" onClick={() => console.log("Post created!")}>
            Post
          </Button>
        </Box>

        {/* Posts Section */}
        <Box sx={{ marginTop: 3 }}>
          <Typography variant="h5" gutterBottom>
            Your Posts
          </Typography>
          {posts.length > 0 ? (
            posts.map((post) => (
              <Box
                key={post._id}
                sx={{ padding: 2, border: "1px solid #ddd", borderRadius: 1, marginBottom: 2 }}
              >
                <Typography variant="h6">{post.title}</Typography>
                <Typography variant="body1">{post.content}</Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2">You haven't posted anything yet.</Typography>
          )}
        </Box>
      </SignedIn>
      <SignedOut>
        <Typography variant="h5">
          You are not signed in. Please sign in to access your dashboard.
        </Typography>
      </SignedOut>
    </Container>
  );
};

export default Dashboard;
