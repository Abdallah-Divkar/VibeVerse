import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn, SignUp, SignIn } from "@clerk/clerk-react";
import Dashboard from "./components/Dashboard";
import NewPost from "./components/NewPost";
import EditProfile from "./components/EditProfile";  // Import EditProfile
import Profile from "./components/Profile";  // Import Profile
import AllPosts from "./components/AllPost";  // Import AllPosts
import Navbar from "./components/Navbar"; // Import Navbar

const App = () => {
  return (
    <Router>
      <Navbar /> {/* Include Navbar here */}

      <Routes>
        {/* Root Route: Redirect based on auth status */}
        <Route
          path="/"
          element={
            <>
              <SignedIn>
                {/* Redirect signed-in users to Dashboard */}
                <Navigate to="/dashboard" />
              </SignedIn>
              <SignedOut>
                {/* Display SignIn page for signed-out users */}
                <SignIn redirectUrl="/dashboard" />
              </SignedOut>
            </>
          }
        />

        {/* SignUp Route */}
        <Route
          path="/signup"
          element={
            <SignedOut>
              {/* Display SignUp page */}
              <SignUp redirectUrl="/dashboard" />
            </SignedOut>
          }
        />

        {/* SignIn Route */}
        <Route
          path="/signin"
          element={
            <SignedOut>
              {/* Display SignIn page */}
              <SignIn redirectUrl="/dashboard" />
            </SignedOut>
          }
        />

        {/* Dashboard Route: Only accessible by signed-in users */}
        <Route
          path="/dashboard"
          element={
            <SignedIn>
              {/* Display Dashboard for authenticated users */}
              <Dashboard />
            </SignedIn>
          }
        />

        {/* EditProfile Route: Only accessible by signed-in users */}
        <Route
          path="/edit-profile"
          element={
            <SignedIn>
              {/* Display Edit Profile page */}
              <EditProfile />
            </SignedIn>
          }
        />

        {/* Profile Route: Display any user's profile */}
        <Route
          path="/profile/:username"
          element={
            <SignedIn>
              {/* Display Profile page of a specific user */}
              <Profile />
            </SignedIn>
          }
        />

        {/* All Posts Route: Display all posts */}
        <Route
          path="/all-posts"
          element={
            <SignedIn>
              {/* Display All Posts page */}
              <AllPosts />
            </SignedIn>
          }
        />

        {/* New Post Route */}
        <Route
          path="/new-post"
          element={
            <SignedIn>
              {/* Display New Post page */}
              <NewPost />
            </SignedIn>
          }
        />

        {/* Catch-all Route: Redirect unauthenticated users to SignIn */}
        <Route path="*" element={<div>Page not found. Please log in to access the app.</div>} />
      </Routes>
    </Router>
  );
};

export default App;
