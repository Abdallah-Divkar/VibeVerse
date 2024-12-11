// Function to store JWT in localStorage
export const storeToken = (token) => {
    localStorage.setItem("token", token);
};

export const setToken = (token) => {
    localStorage.setItem('token', token); 
};
  
// Function to retrieve JWT from localStorage
export const getToken = () => {
    return localStorage.getItem("token");
};
  
  // Function to remove JWT from localStorage (logout)
export const removeToken = () => {
    localStorage.removeItem("token");
};

// Function to verify if the user is authenticated (check if token exists)
export const isAuthenticated = () => {
    const token = getToken();
    if (!token) return false;
  
    // Optionally: Add JWT verification logic here (e.g., decode and check expiration)
    return true;
};
  