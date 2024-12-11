import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import EditProfile from './components/EditProfile';
import NewPost from './components/NewPost';
import SearchUsers from "./components/SearchUsers";
import SignIn from './components/SignIn'; // Import SignIn component
import SignUp from './components/SignUp'; // Import SignUp component
import Navbar from './components/Navbar'; // Import Navbar component
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from './PrivateRoute'; // Import PrivateRoute
import { useNavigate, Navigate } from "react-router-dom";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          <Route path="/" element={<Navigate to="/signin" />} />


          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/new-post"
            element={
              <PrivateRoute>
                <NewPost />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <PrivateRoute>
                <EditProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/search"
            element={
              <PrivateRoute>
                <SearchUsers />
              </PrivateRoute>
            }
          />
        </Routes>
        <Navbar /> {/* Navbar is always rendered at the bottom */}
      </Router>
    </AuthProvider>
  );
};

export default App;
