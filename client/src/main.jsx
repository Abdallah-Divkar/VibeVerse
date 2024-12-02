import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react'; 
import App from './App.jsx'; 
//import './main.css'; 

// Retrieve the Clerk publishable key from the environment
const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Ensure the publishable key exists
if (!clerkPublishableKey) {
  throw new Error("Missing Clerk publishable key. Check your .env file.");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);