import React from 'react';
import { List, ListItem, ListItemText, IconButton, Typography, Paper, Box } from '@mui/material';
import { Remove as RemoveIcon } from '@mui/icons-material';

const APIDetails = ({ selectedAPIs, onRemove, dropletJson }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 5}}>
      
      {/* First half: List of selected APIs */}
      <Box sx={{ flex: 1 }}>
        <Paper variant="outlined" elevation={3} sx={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h5" gutterBottom>
            Selected APIs
          </Typography>

          {selectedAPIs.length === 0 ? (
            <Typography variant="body1">No APIs selected</Typography>
          ) : (
            <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
              {selectedAPIs.map((apiName, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton edge="end" aria-label="remove" onClick={() => onRemove(apiName)}>
                      <RemoveIcon />
                    </IconButton>
                  }
                  style={{ borderBottom: '1px solid #ccc' }}
                >
                  <ListItemText primary={apiName} />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Box>

      {/* Second half: JSON object of selected APIs */}
      <Box sx={{ flex: 1 }}>
        <Paper variant="outlined" elevation={3} sx={{ padding: '20px', height: '100%', overflow: 'auto' }}>
          <Typography variant="h5" gutterBottom>
            Droplet JSON Preview
          </Typography>
          <Box
            component="pre"
            sx={{
              backgroundColor: '#f5f5f5',
              padding: '10px',
              borderRadius: '4px',
              height: '100%',
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
            }}
          >
            {JSON.stringify(dropletJson, null, 2)} {/* Render the droplet JSON */}
          </Box>
        </Paper>
      </Box>
      
    </Box>
  );
};

export default APIDetails;
