import React, { useState } from "react";
import { TextField, Button, Typography, Box, Container } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const backendURL = import.meta.env.VITE_BACKEND_URL;

const SignUp = () => {
  //const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${backendURL}/api/users/`, { username, email, password });
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
    <Container sx={{ marginTop: 8 }}>
      <Typography variant="h4" gutterBottom>
        Sign Up
      </Typography>
      <form onSubmit={handleSignUp}>
        <Box sx={{ marginBottom: 2 }}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            required
          />
        </Box>
        <Box sx={{ marginBottom: 2 }}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />
        </Box>
        <Box sx={{ marginBottom: 2 }}>
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
          />
        </Box>
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </Button>
      </form>
      <Typography variant="body2" sx={{ marginTop: 2 }}>
        Already have an account?{" "}
        <Button color="secondary" onClick={() => navigate("/signin")}>
          Sign In
        </Button>
      </Typography>
    </Container>
  );
};

export default SignUp;
