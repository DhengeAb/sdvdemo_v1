import React from 'react';
import { Card, CardContent, Typography, TextField } from '@mui/material';
import './DropletMetadataForm.css'; // Import external CSS for consistency

const DropletMetadataForm = ({ dropletMetadata, handleMetadataChange }) => (
  <Card className="card-metadata">
    <CardContent>
      <Typography variant="h5" className="metadata-heading">
        Droplet Metadata
      </Typography>
      <TextField
        label="Droplet Name"
        name="name"
        variant="outlined"
        fullWidth
        value={dropletMetadata.name}
        onChange={handleMetadataChange}
        className="metadata-input"
      />
      <TextField
        label="Droplet ID"
        name="id"
        variant="outlined"
        fullWidth
        value={dropletMetadata.id}
        onChange={handleMetadataChange}
        className="metadata-input"
      />
      <TextField
        label="Droplet Description"
        name="description"
        variant="outlined"
        fullWidth
        value={dropletMetadata.description}
        onChange={handleMetadataChange}
        className="metadata-input"
      />
      <TextField
        label="Picture URL"
        name="pictureUrl"
        variant="outlined"
        fullWidth
        value={dropletMetadata.pictureUrl}
        onChange={handleMetadataChange}
        className="metadata-input"
      />
    </CardContent>
  </Card>
);

export default DropletMetadataForm;
