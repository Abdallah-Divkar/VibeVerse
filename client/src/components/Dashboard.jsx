import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";

const Dashboard = () => {
  const { user } = useUser(); // Fetch Clerk's authenticated user
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user profile and posts
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Fetch all users and filter the current user's profile
        const allUsersRes = await axios.get("/api/users");
        const currentUser = allUsersRes.data.find((u) => u.email === user.email);

        if (!currentUser) {
          throw new Error("User profile not found.");
        }

        setProfile(currentUser);

        // Fetch user's posts
        const postsRes = await axios.get(`/api/users/${currentUser._id}/posts`);
        setPosts(Array.isArray(postsRes.data) ? postsRes.data : []);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("Unable to fetch user data.");
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={styles.container}>
      <h1>Welcome, {profile.name}!</h1>

      {/* Profile Section */}
      <div style={styles.profile}>
        <img
          src={profile.profilePic || "default-profile.png"}
          alt="Profile"
          style={styles.profilePic}
        />
        <div>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Bio:</strong> {profile.bio || "No bio available"}</p>
          <p><strong>Followers:</strong> {profile.followers.length}</p>
          <p><strong>Following:</strong> {profile.following.length}</p>
        </div>
      </div>

      {/* Posts Section */}
      <div style={styles.postsContainer}>
        <h2>Your Posts</h2>
        {posts.length > 0 ? (
          <ul style={styles.postList}>
            {posts.map((post) => (
              <li key={post._id} style={styles.postItem}>
                <h3>{post.title}</h3>
                <p>{post.content}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>You haven't posted anything yet.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
  },
  profile: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "20px",
  },
  profilePic: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    marginRight: "20px",
    objectFit: "cover",
  },
  postsContainer: {
    marginTop: "20px",
  },
  postList: {
    listStyleType: "none",
    padding: "0",
  },
  postItem: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    marginBottom: "10px",
  },
};

export default Dashboard;
