import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, Button, TextField, Avatar, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    username: "",
    bio: "",
    profilePic: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/signin");
      return;
    }

    setUser(JSON.parse(storedUser));
    setIsLoading(false);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = () => {
    localStorage.setItem("user", JSON.stringify(user));
    alert("Profile updated!");
  };

  return isLoading ? (
    <p>Loading...</p>
  ) : (
    <div>
      <h2>Edit Profile</h2>
      <form>
      <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Bio</label>
          <textarea
            name="bio"
            value={user.bio}
            onChange={handleChange}
          ></textarea>
        </div>
        <div>
          <label>Profile Picture URL</label>
          <input
            type="text"
            name="profilePic"
            value={user.profilePic}
            onChange={handleChange}
          />
        </div>
        <button type="button" onClick={handleSave}>
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;