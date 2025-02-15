import React, { useState } from "react";
import axios from "axios";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import "../Signin.css";
import { useAuth } from "../context/AuthContext";
import { Typography, Button } from "@mui/material"; // Import Typography and Button

const backendURL = import.meta.env.REACT_APP_BACKEND_URL;
//const backendURL = import.meta.env.REACT_APP_BACKEND_URL;

const SignIn = () => {
  const [credentials, setCredentials] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();  // Access login function from context

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const axiosInstance = axios.create({
    //baseURL: import.meta.env.VITE_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL,
    baseURL: import.meta.env.REACT_APP_BACKEND_URL,

    headers: {
      'Content-Type': 'application/json',
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      //const response = await axiosInstance.post(`${backendURL}/api/auth/signin`, credentials);
      const response = await axiosInstance.post(`http://localhost:3000/api/auth/signin`, credentials);

      if (response.data.success) {
        // Store token and user in localStorage
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('userId', response.data.user.id);

        const token = localStorage.getItem('authToken', response.data.token);
        console.log("Retrieved Token:", token);
        // Update context
        login(response.data.user, response.data.token); // Use login function from context
  
        // Wait for context to update, then navigate
        setTimeout(() => {
          navigate('/dashboard');
        }, 0);
      } else {
        alert('Invalid credentials');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while signing in.');
    }
  };  

  return (
    <div className="sign-in-container">
      <form onSubmit={handleSubmit} className="sign-in-form">
        <h1>VibeVerse</h1>
        <div className="form-group">
          <label htmlFor="usernameOrEmail">Username or Email</label>
          <input
            type="text"
            id="usernameOrEmail"
            name="usernameOrEmail"
            value={credentials.usernameOrEmail}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Sign In</button>

        <Typography variant="body2" sx={{ marginTop: 2 }}>
          Don't have an account?{" "}
          <Button color="primary" onClick={() => navigate("/signup")}>
            Sign Up
          </Button>
        </Typography>
      </form>


    </div>
  );
};

export default SignIn;
