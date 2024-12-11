import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; 

const PrivateRoute = ({ children }) => {
  const { user } = useAuth(); 

  if (!user) {
    return <Navigate to="/signin" />; // Redirect to signin if user is not authenticated
  }

  return children; // Render the protected route if user is authenticated
};

export default PrivateRoute;
