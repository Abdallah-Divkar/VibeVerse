import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, List, ListItem, ListItemText, CircularProgress } from '@mui/material';

const SearchUsers = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (query.trim() === '') return; // Do not search if query is empty
    setLoading(true);
    try {
      // Call the backend to fetch users by name or username
      const response = await axios.get(`/api/users/search?query=${query}`);
      setResults(response.data.users || []); // Ensure that the response is an array
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <TextField
        label="Search for users"
        variant="outlined"
        fullWidth
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
      />
      <Button variant="contained" onClick={handleSearch} style={{ marginTop: '10px' }}>
        Search
      </Button>
      {loading ? (
        <CircularProgress style={{ marginTop: '20px' }} />
      ) : (
        <List>
          {Array.isArray(results) && results.length > 0 ? (
            results.map((user) => (
              <ListItem key={user._id}>
                <ListItemText primary={user.username} secondary={user.name} />
              </ListItem>
            ))
          ) : (
            <ListItem>No results found</ListItem>
          )}
        </List>
      )}
    </Box>
  );
};

export default SearchUsers;
