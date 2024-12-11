import React, { createContext, useState, useContext, useEffect } from 'react';
import { getToken, setToken, removeToken } from '../utils/auth';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user and token from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = getToken();
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser)); // Parse and set the user
    }
  }, []);

  const loadUser = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  };

  const login = (userData, token) => {
    if (!user) {
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      setUser(userData); // Update context state
      setToken(token); // Update token state
    }
  };

  const logout = () => {
    removeToken(); // Remove token using utility
    localStorage.removeItem('user'); // Remove user from localStorage
    setUser(null); // Clear user from state
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};
