import React, { useState, useEffect } from "react";
import axios from "axios";
const backendURL = import.meta.env.REACT_APP_BACKEND_URL;
import { useParams } from "react-router-dom";
import { Box, Typography, Avatar } from "@mui/material";

const Profile = () => {
  const { username } = useParams();  // Access the username from URL params
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/users/${username}`);  // Fetch user profile by username
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };
    fetchUser();
  }, [username]);

  if (!user) return <div>Loading...</div>;

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        {user.username}'s Profile
      </Typography>
      <Avatar src={user.profilePic || "/default-profile.png"} alt={user.username} sx={{ width: 100, height: 100 }} />
      <Typography variant="h6" gutterBottom>
        {user.name}
      </Typography>
      <Typography variant="body1">{user.bio}</Typography>
      {/* Display more user info if needed */}
    </Box>
  );
};

export default Profile;
