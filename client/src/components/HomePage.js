import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to VibeVerse</h1>
      <nav>
        <Link to="/users">Users</Link> | <Link to="/signup">Sign Up</Link> |{" "}
        <Link to="/signin">Sign In</Link>
      </nav>
    </div>
  );
};

export default HomePage;