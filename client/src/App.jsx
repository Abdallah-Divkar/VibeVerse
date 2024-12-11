import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./components/Dashboard";
import NewPost from "./components/NewPost";
import EditProfile from "./components/EditProfile";
import Profile from "./components/Profile";
import AllPosts from "./components/AllPost";
import Navbar from "./components/Navbar";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from "./PrivateRoute";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/signin" />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/navbar" element={<Navbar />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/new-post" element={<PrivateRoute><NewPost /></PrivateRoute>} />
          <Route path="/edit-profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/all-posts" element={<PrivateRoute><AllPosts /></PrivateRoute>} />
        </Routes>
        <ToastContainer />
      </Router>
    </AuthProvider>
  );
};

export default App;
