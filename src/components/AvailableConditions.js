// AvailableConditions.js
import React from 'react';
import { Card, CardContent, Typography, TextField, IconButton, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const AvailableConditions = ({ vehicleConditions, onSelect, label = "Select Conditions" }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>{label}</Typography>
        <TextField placeholder="Search Condition" fullWidth />
        {vehicleConditions.map(condition => (
          <Box key={condition.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 1 }}>
            <Typography>{condition.name}</Typography>
            <IconButton onClick={() => onSelect({ ...condition, parameters: condition.parameters || { defaultParam: 'exampleValue' } })}>
              <AddIcon />
            </IconButton>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default AvailableConditions;
