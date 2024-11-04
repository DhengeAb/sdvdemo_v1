import React, { useState, useEffect } from 'react';
import { Grid, Box, Button, TextField, Card, CardContent, Typography, Fab, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { Edit as EditIcon, Remove as RemoveIcon } from '@mui/icons-material';
import DropletMetadataForm from './DropletMetadataForm';
import SelectVehicles from './SelectVehicles';
import AvailableAPIs from './AvailableAPIs';
import AvailableConditions from './AvailableConditions';
import AvailableTriggers from './AvailableTriggers';
import { vehicleAPIs, vehicleConditions, vehicleTriggers } from '../Data/VehicleAPIs';
import { fetchDroplets } from '../Data/storedDroplets';
import { useParams, useNavigate } from 'react-router-dom';

const EditDropletBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dropletMetadata, setDropletMetadata] = useState({
    name: '',
    id: '',
    description: '',
    pictureUrl: ''
  });
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [selectedAPIs, setSelectedAPIs] = useState([]);
  const [selectedTriggers, setSelectedTriggers] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [jsonContent, setJsonContent] = useState('');
  const [isJsonDialogOpen, setIsJsonDialogOpen] = useState(false);

  useEffect(() => {
    const loadDroplet = async () => {
      const droplets = await fetchDroplets();
      const droplet = droplets.find(d => d.id === id);
      if (droplet) {
        // Set metadata
        setDropletMetadata({
          name: droplet.name,
          id: droplet.id,
          description: droplet.description,
          pictureUrl: droplet.metadata?.iconUrl || ''
        });

        // Populate selected vehicles, actions, triggers, and conditions
        setSelectedVehicles(droplet.vehicles || []);
        setSelectedAPIs(droplet.actions?.map(api => ({
          id: api.id,
          vssPath: api.vssSignal,
          name: api.name || api.vssSignal,
          value: api.value || '',
        })) || []);

        setSelectedTriggers(droplet.triggers?.map(trigger => ({
          id: trigger.id,
          vssPath: trigger.vss_signal,
          name: trigger.type || trigger.vss_signal,
          operator: trigger.operator || '',
          value: trigger.value || '',
        })) || []);

        setSelectedConditions(droplet.conditions?.map(condition => ({
          id: condition.id,
          name: condition.type,
          parameters: condition.parameters || {},
        })) || []);

        setJsonContent(JSON.stringify(droplet, null, 2));
      }
    };
    loadDroplet();
  }, [id]);

  // Update JSON content whenever actions, triggers, or conditions change
  useEffect(() => {
    const updatedDroplet = {
      id: dropletMetadata.id,
      name: dropletMetadata.name,
      description: dropletMetadata.description,
      triggers: selectedTriggers,
      conditions: selectedConditions,
      actions: selectedAPIs,
      metadata: {
        ...dropletMetadata,
        iconUrl: dropletMetadata.pictureUrl
      },
      vehicles: selectedVehicles
    };

    setJsonContent(JSON.stringify(updatedDroplet, null, 2));
  }, [selectedAPIs, selectedTriggers, selectedConditions, selectedVehicles, dropletMetadata]);

  const handleMetadataChange = (e) => {
    const { name, value } = e.target;
    setDropletMetadata(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSelectVehicle = (vehicle) => {
    setSelectedVehicles(prevSelected =>
      prevSelected.includes(vehicle)
        ? prevSelected.filter(v => v !== vehicle)
        : [...prevSelected, vehicle]
    );
  };

  const handleSelectAPI = (api) => {
    setSelectedAPIs(prevSelected => {
      const exists = prevSelected.find(a => a.vssPath === api.vssPath);
      return exists ? prevSelected.filter(a => a.vssPath !== api.vssPath) : [...prevSelected, { ...api, value: '' }];
    });
  };

  const handleSelectTrigger = (trigger) => {
    setSelectedTriggers(prevSelected => {
      const exists = prevSelected.find(a => a.vssPath === trigger.vssPath);
      return exists ? prevSelected.filter(a => a.vssPath !== trigger.vssPath) : [...prevSelected, { ...trigger, value: '' }];
    });
  };

  const handleSelectCondition = (condition) => {
    setSelectedConditions(prevSelected => {
      const exists = prevSelected.find(a => a.name === condition.name);
      return exists ? prevSelected.filter(a => a.name !== condition.name) : [...prevSelected, { ...condition }];
    });
  };

  const handleAPIValueChange = (vssPath, value) => {
    setSelectedAPIs(prevSelected =>
      prevSelected.map(api =>
        api.vssPath === vssPath ? { ...api, value } : api
      )
    );
  };

  const handleRemoveAPI = (vssPath) => {
    setSelectedAPIs(prevSelected =>
      prevSelected.filter(api => api.vssPath !== vssPath)
    );
  };

  const handleRemoveTrigger = (vssPath) => {
    setSelectedTriggers(prevSelected =>
      prevSelected.filter(trigger => trigger.vssPath !== vssPath)
    );
  };

  const handleRemoveCondition = (vssPath) => {
    setSelectedConditions(prevSelected =>
      prevSelected.filter(condition => condition.vssPath !== vssPath)
    );
  };

  const handleSaveDroplet = () => {
    const apiUrl = `https://z0j52jzpbf.execute-api.ap-south-1.amazonaws.com/sandbox/scenarios/${dropletMetadata.id}`;
    const apiKey = "kyVPsZTlNG3jDng67dMZi6wDPuRJmO3y86E4SUaV";
    const updatedDroplet = {
      id: dropletMetadata.id,
      name: dropletMetadata.name,
      description: dropletMetadata.description,
      triggers: selectedTriggers,
      conditions: selectedConditions,
      actions: selectedAPIs,
      metadata: {
        ...dropletMetadata,
        iconUrl: dropletMetadata.pictureUrl
      },
      vehicles: selectedVehicles
    };

    fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey
      },
      body: JSON.stringify(updatedDroplet),
      mode: 'cors'
    })
      .then(response => response.json())
      .then(data => {
        alert('Droplet updated successfully!');
        navigate('/view-droplets');
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to update droplet.');
      });
  };

  const handleOpenJsonDialog = () => {
    setIsJsonDialogOpen(true);
  };

  const handleCloseJsonDialog = () => {
    setIsJsonDialogOpen(false);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent sx={{ height: '400px', overflowY: 'auto' }}>
            <DropletMetadataForm 
              dropletMetadata={dropletMetadata} 
              handleMetadataChange={handleMetadataChange}
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent sx={{ height: '400px', overflowY: 'auto' }}>
            <SelectVehicles vehicles={['Vehicle 1', 'Vehicle 2', 'Vehicle 3']} selectedVehicles={selectedVehicles} handleSelectVehicle={handleSelectVehicle} />
          </CardContent>
        </Card>
      </Grid>

      <Grid container item spacing={0} xs={12} justifyContent="center">
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ height: '400px', overflowY: 'auto' }}>
              <AvailableAPIs vehicleAPIs={vehicleAPIs} onSelect={handleSelectAPI} label="Select Actions" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ height: '400px', overflowY: 'auto' }}>
              <Typography variant="h5" gutterBottom>Action</Typography>
              {selectedAPIs.map(api => (
                <Box key={api.vssPath} sx={{ marginBottom: 2, display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{ flexGrow: 1 }}>
                    {api.name} ({api.vssPath})
                  </Typography>
                  <IconButton onClick={() => handleRemoveAPI(api.vssPath)}>
                    <RemoveIcon />
                  </IconButton>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ height: '400px', overflowY: 'auto' }}>
              <Typography variant="h5" gutterBottom>Set API Values</Typography>
              {selectedAPIs.map(api => (
                <Box key={api.vssPath} sx={{ marginBottom: 2, display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{ flexGrow: 1 }}>
                    {api.name} ({api.vssPath})
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Value"
                    value={api.value}
                    onChange={(e) => handleAPIValueChange(api.vssPath, e.target.value)}
                    sx={{ marginTop: 1 }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container item spacing={3} xs={12}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ height: '400px', overflowY: 'auto' }}>
              <AvailableTriggers vehicleTriggers={vehicleTriggers} onSelect={handleSelectTrigger} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ height: '400px', overflowY: 'auto' }}>
              <Typography variant="h5" gutterBottom>Triggers</Typography>
              {selectedTriggers.map(trigger => (
                <Box key={trigger.vssPath} sx={{ marginBottom: 2, display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{ flexGrow: 1 }}>
                    {trigger.name} ({trigger.vssPath})
                  </Typography>
                  <IconButton onClick={() => handleRemoveTrigger(trigger.vssPath)}>
                    <RemoveIcon />
                  </IconButton>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ height: '400px', overflowY: 'auto' }}>
              <Typography variant="h5" gutterBottom>Set Trigger Values</Typography>
              {selectedTriggers.map(trigger => (
                <Box key={trigger.vssPath} sx={{ marginBottom: 2 }}>
                  <Typography variant="body1">
                    {trigger.name} ({trigger.vssPath})
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Value"
                    value={trigger.value}
                    onChange={(e) => handleAPIValueChange(trigger.vssPath, e.target.value)}
                    sx={{ marginTop: 1 }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container item spacing={3} xs={12}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ height: '400px', overflowY: 'auto' }}>
              <AvailableConditions vehicleConditions={vehicleConditions} onSelect={handleSelectCondition} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ height: '400px', overflowY: 'auto' }}>
              <Typography variant="h5" gutterBottom>Conditions</Typography>
              {selectedConditions.map(condition => (
                <Box key={condition.vssPath} sx={{ marginBottom: 2, display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{ flexGrow: 1 }}>
                    {condition.name} ({condition.vssPath})
                  </Typography>
                  <IconButton onClick={() => handleRemoveCondition(condition.vssPath)}>
                    <RemoveIcon />
                  </IconButton>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ height: '400px', overflowY: 'auto' }}>
              <Typography variant="h5" gutterBottom>Set Condition Values</Typography>
              {selectedConditions.map(condition => (
                <Box key={condition.vssPath} sx={{ marginBottom: 2 }}>
                  <Typography variant="body1">
                    {condition.name} ({condition.vssPath})
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Value"
                    value={condition.value}
                    onChange={(e) => handleAPIValueChange(condition.vssPath, e.target.value)}
                    sx={{ marginTop: 1 }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Fab color="primary" aria-label="edit" onClick={handleOpenJsonDialog} sx={{ position: 'fixed', bottom: 16, right: 16 }}>
        <EditIcon />
      </Fab>
      <Dialog open={isJsonDialogOpen} onClose={handleCloseJsonDialog} maxWidth="md" fullWidth>
        <DialogTitle>Edit Droplet JSON</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={20}
            variant="outlined"
            value={jsonContent}
            onChange={(e) => setJsonContent(e.target.value)}
          />
          <Box sx={{ textAlign: 'right', marginTop: 2 }}>
            <Button onClick={handleCloseJsonDialog} variant="contained" color="primary">
              Save
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <Grid item xs={12} sx={{ textAlign: 'center', marginTop: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveDroplet}
          disabled={!dropletMetadata.name || !dropletMetadata.id}
        >
          Save Changes
        </Button>
      </Grid>
    </Grid>
  );
};

export default EditDropletBuilder;
