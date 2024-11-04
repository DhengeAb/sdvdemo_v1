import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import APIList from './APIList';

import { vehicleAPIs } from '../Data/VehicleAPIs';

const AvailableAPIs = ({ onSelect }) => (
<Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
  <CardContent sx={{ flexGrow: 1 }}>
    
    <Box sx={{ maxHeight: '300px', overflowY: 'auto' }}>
      <APIList apis={vehicleAPIs} onSelect={onSelect} />
    </Box>
  </CardContent>
</Card>
);

export default AvailableAPIs;