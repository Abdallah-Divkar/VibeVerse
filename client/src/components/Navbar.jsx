import React from "react";
import { SignedIn, SignedOut, useUser, SignOutButton } from "@clerk/clerk-react";

const Navbar = () => {
  const { firstName } = useUser();

  return (
    <nav style={styles.navbar}>
      <h1>VibeVerse</h1>
      <div style={styles.navLinks}>
        <SignedIn>
          <p>Welcome, {firstName}</p>
          <SignOutButton>
            <button style={styles.signOutButton}>Sign Out</button>
          </SignOutButton>
        </SignedIn>
        <SignedOut>
          <a href="/signin" style={styles.navLink}>
            Sign In
          </a>
          <a href="/signup" style={styles.navLink}>
            Sign Up
          </a>
        </SignedOut>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 20px",
    backgroundColor: "#0095f6",
    color: "white",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
  },
  navLink: {
    color: "white",
    textDecoration: "none",
    marginLeft: "15px",
  },
  signOutButton: {
    backgroundColor: "white",
    color: "#0095f6",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Navbar;
