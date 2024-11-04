import React from 'react';
import { Card, CardContent, Typography, FormControl, FormControlLabel, Checkbox } from '@mui/material';

const SelectVehicles = ({ vehicles, selectedVehicles, handleSelectVehicle }) => (
  <Card sx={{ 
    height: '100%', 
    zIndex: 100, 
    boxShadow: 3, 
    backgroundColor: '#000000', 
    color: '#00FF00',
    fontFamily: 'Roboto Mono, monospace' // Apply the font here
  }}>
    <CardContent>
      <Typography variant="h5" gutterBottom sx={{ color: '#00FF00', fontFamily: 'Roboto Mono, monospace' }}>
        Select Model
      </Typography>
      <FormControl component="fieldset">
        {vehicles.map(vehicle => (
          <FormControlLabel
            key={vehicle}
            control={
              <Checkbox 
                checked={selectedVehicles.includes(vehicle)} 
                onChange={() => handleSelectVehicle(vehicle)} 
                sx={{ 
                  color: '#00FF00', 
                  '&.Mui-checked': { color: '#00FF00' },
                  fontFamily: 'Roboto Mono, monospace' // Ensure checkbox uses the font
                }}
              />
            }
            label={vehicle}
            sx={{ color: '#00FF00', fontFamily: 'Roboto Mono, monospace' }}
          />
        ))}
      </FormControl>
    </CardContent>
  </Card>
);

export default SelectVehicles;
