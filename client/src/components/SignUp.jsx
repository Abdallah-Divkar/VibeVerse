import React, { useState } from "react";
import { TextField, Button, Typography, Box, Container } from "@mui/material";
import axios from "axios";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../Signin.css";  // Import the same CSS file
import "react-toastify/dist/ReactToastify.css";

const backendURL = import.meta.env.VITE_BACKEND_URL;

const SignUp = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post(`/users/`, {
        name,
        username,
        email,
        password,
      });
      console.log("Backend URL:", backendURL);
      toast.success("Account created successfully! Please sign in.");
      navigate("/signin");
    } catch (err) {
      console.error("Sign-up error:", err);
      toast.error("Error creating account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sign-in-container">
      <form onSubmit={handleSignUp} className="sign-in-form">
        <h1>VibeVerse</h1>

        {/* Name Field */}
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Username Field */}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        {/* Email Field */}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password Field */}
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        {/* Sign In Link */}
        <div className="form-group">
          <Typography variant="body2" sx={{ marginTop: 2 }}>
            Already have an account?{" "}
            <Button color="secondary" onClick={() => navigate("/signin")}>
              Sign In
            </Button>
          </Typography>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
