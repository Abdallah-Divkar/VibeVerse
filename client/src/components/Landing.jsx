import React, { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import "../Landing.css";

const Landing = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      navigate("/dashboard");
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="landing-container">
      <div className="center-content">
        <h1>Welcome to VibeVerse!</h1>
        <p>Connect, share, and vibe with the world.</p>
        <div className="cta-buttons">
        <SignUpButton mode="redirect">
            <button className="signup-button">Get Started</button>
          </SignUpButton>
          <SignInButton mode="redirect">
            <button className="signin-button">Sign In</button>
          </SignInButton>
        </div>
        <div className="center-footer">
          <p>&copy; {new Date().getFullYear()} VibeVerse. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
