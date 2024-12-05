import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, Button, TextField, Avatar, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditProfile = () => {
  const [user, setUser] = useState({
    username: "",
    name: "",
    email: "",
    bio: "",
    profilePic: "",
  });
  const [loading, setLoading] = useState(false);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [error, setError] = useState(null);

  // Fetch user data to populate the form
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get("/api/users/me"); // Assuming this endpoint returns current user data
        setUser({
          username: res.data.username,
          name: res.data.name,
          email: res.data.email,
          bio: res.data.bio,
          profilePic: res.data.profilePic,
          _id: res.data._id, // Make sure _id is included
        });
      } catch (err) {
        console.error("Error fetching user data:", err);
        toast.error("Failed to load user data.");
      }
    };
    fetchUserProfile();
  }, []);
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file);
    }
  };

  const handleSave = async () => {
    if (!user._id) {
      console.error("User ID is missing");
      toast.error("User ID is missing.");
      return;
    }
  
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("username", user.username);
      formData.append("name", user.name);
      formData.append("email", user.email);
      formData.append("bio", user.bio);
      if (profilePicFile) {
        formData.append("profilePic", profilePicFile);
      }
  
      // Update user profile, pass user ID from state
      const res = await axios.put(`/api/users/update/${user._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      setUser(res.data); // Update local state with the updated user data
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Error saving profile:", err);
      const message = err.response?.data?.message || "Failed to update profile.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Edit Profile
      </Typography>

      {loading ? (
        <CircularProgress sx={{ display: "block", margin: "auto" }} />
      ) : (
        <>
          {error && <Typography color="error">{error}</Typography>}

          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 2 }}>
            <Avatar
              src={user.profilePic || "/default-profile.png"}
              alt="Profile Picture"
              sx={{ width: 100, height: 100, marginBottom: 2 }}
            />
            <Button variant="contained" component="label">
              Upload New Picture
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
          </Box>

          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            value={user.username || ""}  
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            sx={{ marginBottom: 2 }}
          />

          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={user.name || ""}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            sx={{ marginBottom: 2 }}
          />

          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={user.email || ""}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            sx={{ marginBottom: 2 }}
          />

          <TextField
            label="Bio"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={user.bio || ""}  // Default to empty string if undefined
            onChange={(e) => setUser({ ...user, bio: e.target.value })}
            sx={{ marginBottom: 2 }}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            sx={{ padding: "10px 20px", marginTop: 2 }}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </>
      )}
    </Box>
  );
};

export default EditProfile;
