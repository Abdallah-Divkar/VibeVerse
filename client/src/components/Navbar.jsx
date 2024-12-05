import React from "react";
import { SignedIn, SignedOut, useUser, SignOutButton } from "@clerk/clerk-react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { firstName } = useUser();

  return (
    <AppBar position="static" sx={{ backgroundColor: "#0095f6" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          VibeVerse
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <SignedIn>
            <Typography variant="body1" sx={{ marginRight: 2 }}>
              Welcome, {firstName}
            </Typography>
            <SignOutButton>
              <Button variant="contained" color="secondary">
                Sign Out
              </Button>
            </SignOutButton>
          </SignedIn>
          <SignedOut>
            <Button
              component={Link}
              to="/signin"
              variant="text"
              sx={{ color: "white", marginLeft: 2 }}
            >
              Sign In
            </Button>
            <Button
              component={Link}
              to="/signup"
              variant="text"
              sx={{ color: "white", marginLeft: 2 }}
            >
              Sign Up
            </Button>
          </SignedOut>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
