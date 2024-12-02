import React, { useState, useEffect } from "react";
import "../Dashboard.css";
import axios from "axios";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);

  // Fetch user data from backend API
  useEffect(() => {
    // Replace with your actual API endpoint
    axios.get("/api/user") 
      .then((response) => {
        setUserData(response.data.user); // Assuming 'user' contains the user info
        setPosts(response.data.posts);   // Assuming 'posts' contains the user's posts
      })
      .catch((error) => {
        console.error("Error fetching user data", error);
      });
  }, []);

  if (!userData) {
    return <div>Loading...</div>; // Show loading while data is being fetched
  }

  return (
    <div className="dashboard-container">
      {/* Profile Section */}
      <div className="profile-section">
        <img
          src={userData.profilePicture || "https://via.placeholder.com/80"} // Use Cloudinary URL or fallback image
          alt="Profile"
          className="profile-picture"
        />
        <div className="profile-info">
          <h3>{userData.username}</h3>
          <p>{userData.name}</p>
          <p>{userData.bio}</p>
          <button className="edit-profile-button">Edit Profile</button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <div>
          <p className="stats-number">{userData.postsCount}</p>
          <p>Posts</p>
        </div>
        <div>
          <p className="stats-number">{userData.followers}</p>
          <p>Followers</p>
        </div>
        <div>
          <p className="stats-number">{userData.following}</p>
          <p>Following</p>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="tabs-section">
        <div className="tab active">
          <i className="fas fa-th-large"></i>
        </div>
        <div className="tab">
          <i className="fas fa-heart"></i>
        </div>
      </div>

      {/* Posts Section */}
      <div className="posts-section">
        {posts.map((post, index) => (
          <img
            key={index}
            src={post.imageUrl || "https://via.placeholder.com/150"} // Use Cloudinary URL for post image
            alt="Post"
            className="post-image"
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
