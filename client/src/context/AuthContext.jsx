import React, { createContext, useState, useContext, useEffect } from 'react';
import { getToken, setToken, removeToken } from '../utils/auth';

const storedUser = localStorage.getItem('user');
const token = getToken();

const AuthContext = createContext();

// Hook to access AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initial state for user

  // Debugging: Log user state whenever it changes
  useEffect(() => {
    console.log('AuthContext User State:', user);
  }, [user]);

  // Load user and token from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = getToken();

    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({
          userId: parsedUser.userId,
          name: parsedUser.name || '', // Fallback for name
          username: parsedUser.username,
          email: parsedUser.email,
          profilePic: parsedUser.profilePic || '', // Fallback for profilePic
        });
      } catch (error) {
        console.error('Failed to parse stored user:', error);
      }
    }
  }, []);

  // Login function: Save user and token, update state
  const login = (userData, token) => {
    console.log('userData in login:', userData); // Debugging
    const userToStore = {
      userId: userData.userId || userData._id, // Check for both possible keys
      name: userData.name || '',
      username: userData.username,
      email: userData.email,
      profilePic: userData.profilePic || '', // Provide fallback for missing profilePic
    };
  
    localStorage.setItem('user', JSON.stringify(userToStore));
    setToken(token);
    setUser(userToStore);
  };

  // Logout function: Clear localStorage and reset state
  const logout = () => {
    removeToken(); // Remove token from storage
    localStorage.removeItem('user'); // Remove user data from storage
    setUser(null); // Reset user state
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
