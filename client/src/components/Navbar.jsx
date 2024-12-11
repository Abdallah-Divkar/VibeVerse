import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ onSignOut }) => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("user");
    onSignOut();
    navigate("/signin");
  };

  return (
    <nav>
      <ul>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/edit-profile">Edit Profile</Link>
        </li>
        <li>
          <Link to="/new-post">New Post</Link> {/* Added link */}
        </li>
        <li>
          <button onClick={handleSignOut}>Sign Out</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
