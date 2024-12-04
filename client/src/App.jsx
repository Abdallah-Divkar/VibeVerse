import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn, SignUp, SignIn } from "@clerk/clerk-react";
import Dashboard from "./components/Dashboard";

const App = () => {
  return (
    <Router>
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

        {/* Catch-all Route: Redirect unauthenticated users to SignIn */}
        <Route path="*" element={<RedirectToSignIn />} />
      </Routes>
    </Router>
  );
};

export default App;
