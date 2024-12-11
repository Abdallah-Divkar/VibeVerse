import React, { useState } from "react";
import axios from "axios";
import { Button, TextField } from "@mui/material";
import { toast } from "react-toastify"; 

const backendURL = import.meta.env.VITE_BACKEND_URL;

const EditProfile = ({ currentUsername, currentBio, currentProfilePic, setUserProfile }) => {
  const [profilePic, setProfilePic] = useState(null);
  const [username, setUsername] = useState(currentUsername || "");
  const [bio, setBio] = useState(currentBio || "");

  const handleFileChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (profilePic) {
      formData.append("profilePic", profilePic);
    }
    if (username !== currentUsername) {
      formData.append("username", username);
    }
    if (bio !== currentBio) {
      formData.append("bio", bio);
    }

    try {
      const response = await axios.post(`${backendURL}/api/users/updateProfile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Profile updated successfully!");
      console.log("Profile updated:", response.data);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        fullWidth
        margin="normal"
      />
      <input type="file" onChange={handleFileChange} />
      <Button type="submit" variant="contained">
        Update Profile
      </Button>
    </form>
  );
};

export default EditProfile;
