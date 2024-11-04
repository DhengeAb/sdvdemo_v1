// AvailableTriggers.js
import React from 'react';
import { Card, CardContent, Typography, TextField, IconButton, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const AvailableTriggers = ({ vehicleTriggers = [], onSelect, label = "Select Triggers" }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>{label}</Typography>
        <TextField placeholder="Search Trigger" fullWidth />
        {vehicleTriggers.map(trigger => (
          <Box key={trigger.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 1 }}>
            <Typography>{trigger.name}</Typography>
            <IconButton onClick={() => onSelect(trigger)}>
              <AddIcon />
            </IconButton>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default AvailableTriggers;
