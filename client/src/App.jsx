import React from "react";
import { SignedIn, SignedOut, SignIn, SignUp } from "@clerk/clerk-react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import NewPost from "./components/NewPost";
import EditProfile from "./components/EditProfile";  // Import EditProfile
import Profile from "./components/Profile";  // Import Profile
import AllPosts from "./components/AllPost";  // Import AllPosts
import Navbar from "./components/Navbar"; 

const App = () => {
  //const clerkFrontendApi = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  return (
      <Router>
        <Navbar />

        <Routes>
          <Route
            path="/"
            element={
              <>
                <SignedIn>
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
            element={<SignedOut><SignUp redirectUrl="/dashboard" /></SignedOut>}
          />

          {/* SignIn Route */}
          <Route
            path="/signin"
            element={
              <SignedOut>
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
          <Route
            path="*"
            element={<Navigate to="/signin" />}
          />
        </Routes>
      </Router>
  );
};

export default App;
