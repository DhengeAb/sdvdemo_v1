import React, { useState } from 'react';
import { List, ListItem, ListItemText, TextField, IconButton, Typography, Paper } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const APIList = ({ apis, onSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter the APIs based on the search query, ensuring each api is defined and has a name
  const filteredAPIs = apis.filter(api => api && api.name && api.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <Paper
      variant="outlined"
      elevation={3}
      style={{
        padding: '20px',
        height: '100%',
        overflowY: 'auto',
        borderColor: '#ccc', // Optional: customize the border color
      }}
    >
      <Typography variant="h5" gutterBottom>
        Vehicle APIs
      </Typography>

      {/* Search bar */}
      <TextField
        fullWidth
        label="Search API"
        variant="outlined"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        style={{ marginBottom: '20px' }}
      />

      <List>
        {filteredAPIs.map((api, index) => (
          <ListItem
            key={index}
            secondaryAction={
              <IconButton edge="end" aria-label="add" onClick={() => onSelect(api)}>
                <AddIcon />
              </IconButton>
            }
            style={{ borderBottom: '1px solid #ccc' }}
          >
            <ListItemText primary={api.name} secondary={api.type} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default APIList;
