import React, { useState } from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Home, Search, Create, Edit } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Navbar = () => {
  const [value, setValue] = useState(0); // To track the selected tab
  const navigate = useNavigate(); // Use useNavigate for navigation

  // Function to handle navigation based on the selected value
  const handleNavigation = (newValue) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        navigate('/dashboard'); // Redirect to dashboard (view user's posts)
        break;
      case 1:
        navigate('/search'); // Redirect to search users
        break;
      case 2:
        navigate('/new-post'); // Redirect to create new post page
        break;
      case 3:
        navigate('/edit-profile'); // Redirect to edit profile page
        break;
      default:
        break;
    }
  };

  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => handleNavigation(newValue)}
      showLabels
      sx={{
        width: '100%',
        position: 'fixed',
        bottom: 0,
        left: 0,
        zIndex: 999, // To keep it on top of other content
      }}
    >
      <BottomNavigationAction
        label="Home"
        icon={<Home />}
        sx={{ fontSize: '1.2rem' }}
      />
      <BottomNavigationAction
        label="Search"
        icon={<Search />}
        sx={{ fontSize: '1.2rem' }}
      />
      <BottomNavigationAction
        label="Create"
        icon={<Create />}
        sx={{ fontSize: '1.2rem' }}
      />
      <BottomNavigationAction
        label="Edit Profile"
        icon={<Edit />}
        sx={{ fontSize: '1.2rem' }}
      />
    </BottomNavigation>
  );
};

export default Navbar;
