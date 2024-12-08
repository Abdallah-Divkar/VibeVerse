import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3000/api' }); // Adjust the baseURL

// Add a token to requests if needed
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
