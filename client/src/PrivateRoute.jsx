import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // Ensure correct import path

const PrivateRoute = ({ children }) => {
  const { user } = useAuth(); // Access the user from the context
  const token = localStorage.getItem('token');

  if (!user || !token) {
    return <Navigate to="/signin" />;
  }

  return children;
};

export default PrivateRoute;
