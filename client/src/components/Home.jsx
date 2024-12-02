import React from "react";

const Home = () => {
  return (
    <div style={styles.container}>
      <h1>Welcome to VibeVerse!</h1>
      <p>This is your personalized home page.</p>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f9f9f9",
    color: "#333",
  },
};

export default Home;
