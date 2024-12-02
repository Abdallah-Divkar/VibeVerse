import React from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
//import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { SignUp, SignIn, useAuth } from "@clerk/clerk-react";
import Landing from "./components/Landing";
//import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
//import SignUp from "./components/SignUp";
//import SignIn from "./components/SignIn";

const PrivateRoute = ({ element }) => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  if (!isSignedIn) {
    // If user is not signed in, redirect to sign-in page
    navigate("/signin");
    return null;
  }

  // Return the element if the user is signed in
  return element;
};

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* SignUp Page */}
        <Route path="/signup" element={<SignUp />} />

        {/* SignIn Page */}
        <Route path="/signin" element={<SignIn />} />

        {/* Private Dashboard Page */}
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
      </Routes>
    </Router>
  );
};

export default App;