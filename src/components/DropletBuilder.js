import React, { useState, useEffect } from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, IconButton, TextField, Grid, Fade , Switch, FormControlLabel,Card, CardContent, Modal,Button } from '@mui/material';
import { ExpandMore as ExpandMoreIcon, KeyboardArrowRight as ChevronRightIcon, KeyboardArrowDown as ChevronDownIcon, Add as AddIcon, Remove as RemoveIcon, Straight } from '@mui/icons-material';
import ReactJson from 'react-json-view';
import { vehicleAPIs, vehicleConditions, vehicleTriggers } from '../Data/VehicleAPIs';
import './DropletBuilder.css';
import Tree from 'react-d3-tree'; // Importing the Tree component
import './custom-tree.css';
import { addDroplet,fetchDropletById,updateDroplet } from '../Data/storedDroplets';
import SplitPane from 'react-split-pane';
import { animate, motion } from "framer-motion";
import { GoCopilot } from "react-icons/go";
import { CardContainer, CardBody, CardItem } from './3d-card';
import CloseIcon from '@mui/icons-material/Close';
import { useLocation } from 'react-router-dom';
import AppBarComponent from './AppBarComponents';  // Ensure the path is correct
import ImageSelector from './ImageSelector';








const jsonToTree = (data) => {
  if (typeof data !== 'object' || data === null) {
    return { name: 'Invalid Data', children: [] }; // Provide a fallback structure
  }



  const traverse = (obj) => {
    if (typeof obj === 'object' && obj !== null) {
      return Object.keys(obj).map((key) => ({
        name: key,
        children: typeof obj[key] === 'object' ? traverse(obj[key]) : [{ name: String(obj[key]) }],
      }));
    }
    return [{ name: String(obj) }];
  };

  return { name: 'root', children: traverse(data) };
};



const DropletBuilder = () => {
  const [dropletMetadata, setDropletMetadata] = useState({ name: '', id: '', description: '', pictureUrl: '' });
  const [selectedAPIs, setSelectedAPIs] = useState([]);
  const [selectedTriggers, setSelectedTriggers] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [jsonContent, setJsonContent] = useState('{}'); // Initialize with valid JSON
  const [expandedAPIs, setExpandedAPIs] = useState({}); // Track which APIs are expanded
  const [expandedTriggers, setExpandedTriggers] = useState({}); // Track which Triggers are expanded
  const [expandedConditions, setExpandedConditions] = useState({}); // Track which Conditions are expanded
  const [isMetadataExpanded, setIsMetadataExpanded] = useState(false); // Control metadata expansion
  const [apiValueInput, setApiValueInput] = useState({}); // Track input values for each API
  const [triggerValueInput, setTriggerValueInput] = useState({}); // Track input values for each Trigger
  const [conditionValueInput, setConditionValueInput] = useState({}); // Track input values for each Condition
  const [showTreeView, setShowTreeView] = useState(false); // State to toggle view
  const [selectedVehicles, setSelectedVehicles] = useState([]); // Track selected vehicles
  const [openModal, setOpenModal] = useState(false);
  const [apiSearch, setApiSearch] = useState('');
  const [triggerSearch, setTriggerSearch] = useState('');
  const [conditionSearch, setConditionSearch] = useState('');

  const [filteredAPIs, setFilteredAPIs] = useState(vehicleAPIs);
  const [filteredTriggers, setFilteredTriggers] = useState(vehicleTriggers);
  const [filteredConditions, setFilteredConditions] = useState(vehicleConditions);

  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

  const handleImageSelect = (url) => {
    handleMetadataChange({ target: { name: 'pictureUrl', value: url } });
  };

  
    // State for fetched API data
    const [fetchedAPIs, setFetchedAPIs] = useState([]);
    const [fetchedTriggers, setFetchedTriggers] = useState([]);
    const [fetchedConditions, setFetchedConditions] = useState([]);

    const handleSubmitDroplet = async () => {
      const requestBody = {
          Type: "Update",
          ID: dropletMetadata.id, // Assuming `id` is stored in dropletMetadata
          body: {
              Type: "Scenario",
              scenario_name: dropletMetadata.name,
              description: dropletMetadata.description,
              version: "1.0", // Example version, adjust as necessary
              created_time: dropletMetadata.created_time, // Make sure this is managed correctly on create vs update
              updated_time: new Date().toISOString(),
              triggers: selectedTriggers.map(trigger => ({
                  id: trigger.id,
                  type: trigger.type,
                  vss_signal: trigger.vss_signal,
                  operator: trigger.operator,
                  value: trigger.value,
                  conditions: trigger.conditions || {} // Assuming conditions are part of triggers
              })),
              actions: selectedAPIs.map(api => ({
                  id: api.id,
                  type: api.type,
                  vss_signal: api.vss_signal,
                  value: api.value
              })),
              metadata: {
                  approval: true,
                  staging: false,
                  tags: dropletMetadata.tags || ["default"], // Assuming tags are part of metadata
                  icon_url: dropletMetadata.icon_url,
                  image_url: dropletMetadata.pictureUrl,
                  author: "System",
                  category: dropletMetadata.category || "General",
                  priority: 1,
                  popularity: 75,
                  subscription_required: false,
                  free: true,
                  most_used: true,
                  version_history: [],
                  scenario_source: "preset",
                  scenario_lifecycle: "unlimited",
                  scenario_display_config: "visible",
                  scenario_type: "system"
              }
          }
      };
  
      // Now pass this requestBody to the update function
      const response = await updateDroplet(requestBody);
      if (response) {
          alert("Droplet updated successfully!");
          // Additional handling here (e.g., clear form, navigate away)
          setDropletMetadata({ name: '', id: '', description: '', pictureUrl: '' });
          setSelectedAPIs([]);
          setSelectedTriggers([]);
          setSelectedConditions([]);
          setSelectedVehicles([]);
          setJsonContent('{}'); // Reset the JSON content
      } else {
          alert("Failed to update droplet. Please try again.");
      }
  };
  
    


  


  const getDynamicTreeData = () => {
    const extractVssAndValue = (item) => {
      const { vss_signal, value } = item;
      return [
        { name: `vss_signal: ${vss_signal || 'N/A'}` },
        { name: `value: ${value || 'N/A'}` }
      ];
    };

    return {
      name: "root",
      children: [
        {
          name: "Actions",
          children: selectedAPIs.map((api, idx) => ({
            name: `Action ${idx + 1}`,
            children: extractVssAndValue(api),
          })),
        },
        {
          name: "Triggers",
          children: selectedTriggers.map((trigger, idx) => ({
            name: `Trigger ${idx + 1}`,
            children: extractVssAndValue(trigger),
          })),
        },
        {
          name: "Conditions",
          children: selectedConditions.map((condition, idx) => ({
            name: `Condition ${idx + 1}`,
            children: extractVssAndValue(condition),
          })),
        },
      ],
    };
  };

  // Fetch Scenario-Actions data from the new API endpoint
const fetchScenarioActions = async () => {
  try {
    const response = await fetch("https://vrg3y88804.execute-api.ap-south-1.amazonaws.com/dev/Scenario-Actions");
    if (!response.ok) throw new Error('Failed to fetch scenario actions');
    const data = await response.json();
    console.log(data);

    // Set fetched data for actions, triggers, and conditions in state
    setFetchedAPIs(data.body[0].actions || []);
    setFetchedTriggers(data.body[0].Triggers || []);
    setFetchedConditions(data.body[0].conditions || []);
  } catch (error) {
    console.error("Error fetching scenario actions:", error);
  }
};

const location = useLocation();
const droplet = location.state?.droplet; 
const isEditMode = Boolean(droplet);

useEffect(() => {
  if (droplet) {
      setDropletMetadata({
          name: droplet.scenario_name,
          id: droplet.ID,
          description: droplet.description,
          pictureUrl: droplet.metadata?.image_url || '',
      });
      setSelectedAPIs(droplet.actions || []);
      setSelectedTriggers(droplet.triggers || []);
      setSelectedConditions(droplet.conditions || []);
  }
}, [droplet]);



  useEffect(() => {
    try {
      // Build the base JSON structure
      const updatedJson = {
        ID: dropletMetadata.id || "scenario_005",
        Type:"Scenario",
        scenario_name: dropletMetadata.name || "Overspeed Alert",
        description: dropletMetadata.description || "Alerts the driver when the vehicle speed exceeds 80 km/h.",
        version: "1.0",
        created_time: "2024-09-22T10:00:00.000Z",
        updated_time: null,
        "Vehicle Models": selectedVehicles.length > 0 ? selectedVehicles.join(", ") : "Nexon, Harrier",
        metadata: {
          approval: true,
          staging: false,
          tags: ["safety", "speed", "alert"],
          icon_url: "https://example.com/icons/overspeed_alert.png",
          image_url: dropletMetadata.pictureUrl || null,
          author: "System",
          category: "Safety",
          priority: 1,
          popularity: 75,
          subscription_required: false,
          free: true,
          most_used: true,
          version_history: [],
          scenario_source: "preset",
          scenario_lifecycle: "unlimited",
          scenario_display_config: "visible",
          scenario_type: "system"
        }
      };
  
      // Conditionally add 'triggers' if there are any selectedTriggers
      if (selectedTriggers.length > 0) {
        updatedJson.triggers = selectedTriggers.map(trigger => ({
          id: trigger.id || "trigger_030",
          type: trigger.type || "VSSSignalTrigger",
          vss_signal: trigger.vss_signal || "Vehicle.Speed",
          operator: trigger.operator || ">",
          value: trigger.value || 80
        }));
      }
  
      // Conditionally add 'conditions' if there are any selectedConditions
      if (selectedConditions.length > 0) {
        updatedJson.conditions = selectedConditions.map(condition => ({
          id: condition.id || "condition_010",
          type: condition.type || "TimeCondition",
          parameters: {
            start_time: condition.parameters?.start_time || "06:00",
            end_time: condition.parameters?.end_time || "22:00"
          }
        }));
      }
  
      // Conditionally add 'actions' if there are any selectedAPIs
      if (selectedAPIs.length > 0) {
        updatedJson.actions = selectedAPIs.map(action => ({
          id: action.id || "action_030",
          type: action.type || "VSSSignalAction",
          vss_signal: action.vss_signal || "Vehicle.Cabin.Infotainment.Alert",
          value: action.value || "xyz"
        }));
      }
  
      setJsonContent(JSON.stringify(updatedJson, null, 2));
    } catch (error) {
      console.error("Error generating JSON:", error);
      setJsonContent('{}'); // Fallback to empty JSON object
    }
  }, [dropletMetadata, selectedAPIs, selectedTriggers, selectedConditions, selectedVehicles]);

// Filter Actions based on search input
useEffect(() => {
  setFilteredAPIs(fetchedAPIs.filter(api => api.API_Name.toLowerCase().includes(apiSearch.toLowerCase())));
}, [apiSearch, fetchedAPIs]);

// Filter Triggers based on search input
useEffect(() => {
  setFilteredTriggers(fetchedTriggers.filter(trigger => trigger.API_Name.toLowerCase().includes(triggerSearch.toLowerCase())));
}, [triggerSearch, fetchedTriggers]);

// Filter Conditions based on search input
useEffect(() => {
  setFilteredConditions(fetchedConditions.filter(condition => condition.API_Name.toLowerCase().includes(conditionSearch.toLowerCase())));
}, [conditionSearch, fetchedConditions]);


  useEffect(() => {
    fetchScenarioActions();
  }, []);

  useEffect(() => {
    if (droplet) {
        setDropletMetadata({
            name: droplet.scenario_name,
            id: droplet.ID,
            description: droplet.description,
            pictureUrl: droplet.metadata?.image_url || '',
        });
        setSelectedAPIs(droplet.actions || []);
        setSelectedTriggers(droplet.triggers || []);
        setSelectedConditions(droplet.conditions || []);
        // Initialize other state variables if needed
    }
}, [droplet]);

  


  
  

    // Function to convert specific parts of JSON to Tree

  
  

  const handleMetadataChange = (e) => {
    const { name, value } = e.target;
    setDropletMetadata((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleExpansion = (type, vssPath) => {
    if (type === 'api') {
      setExpandedAPIs((prev) => ({
        ...prev,
        [vssPath]: !prev[vssPath]
      }));
    } else if (type === 'trigger') {
      setExpandedTriggers((prev) => ({
        ...prev,
        [vssPath]: !prev[vssPath]
      }));
    } else if (type === 'condition') {
      setExpandedConditions((prev) => ({
        ...prev,
        [vssPath]: !prev[vssPath]
      }));
    }
  };

  const handleValueChange = (type, UUID, value) => {
    if (type === 'api') {
      setApiValueInput(prevState => ({
        ...prevState,
        [UUID]: value
      }));
    } else if (type === 'trigger') {
      setTriggerValueInput(prevState => ({
        ...prevState,
        [UUID]: value
      }));
    } else if (type === 'condition') {
      setConditionValueInput(prevState => ({
        ...prevState,
        [UUID]: value
      }));
    }
  };
  
  
  const addItemToSelected = (type, item) => {
    const addToState = (prevSelected, valueInput) => {
      const exists = prevSelected.find(a => a.UUID === item.UUID);
      if (exists) {
        return prevSelected;
      }
  
      // Attach the input value to the item before adding
      const itemWithValue = { ...item, value: valueInput[item.UUID] || item.value };
      return [...prevSelected, itemWithValue];
    };
  
    if (type === 'api') {
      setSelectedAPIs(prevState => addToState(prevState, apiValueInput));
    } else if (type === 'trigger') {
      setSelectedTriggers(prevState => addToState(prevState, triggerValueInput));
    } else if (type === 'condition') {
      setSelectedConditions(prevState => addToState(prevState, conditionValueInput));
    }
  };
  
  
  
  

  const removeItemFromSelected = (type, UUID) => {
    const removeFromState = (prevSelected) =>
      prevSelected.filter(item => item.UUID !== UUID);
  
    if (type === 'api') {
      setSelectedAPIs(removeFromState);
      setApiValueInput(prevState => {
        const { [UUID]: _, ...rest } = prevState; // Remove the value for this UUID
        return rest;
      });
    } else if (type === 'trigger') {
      setSelectedTriggers(removeFromState);
      setTriggerValueInput(prevState => {
        const { [UUID]: _, ...rest } = prevState;
        return rest;
      });
    } else if (type === 'condition') {
      setSelectedConditions(removeFromState);
      setConditionValueInput(prevState => {
        const { [UUID]: _, ...rest } = prevState;
        return rest;
      });
    }
  };
  
  

  const isItemSelected = (type, UUID) => {
    if (type === 'api') return selectedAPIs.some(api => api.UUID === UUID);
    if (type === 'trigger') return selectedTriggers.some(trigger => trigger.UUID === UUID);
    return selectedConditions.some(condition => condition.UUID === UUID);
  };
  

  const handleJsonEdit = (edit) => {
    // This function is called when the JSON is edited
    setJsonContent(JSON.stringify(edit.updated_src, null, 2));
    // Here, also update the state that reflects the edits
    const updatedData = edit.updated_src;
    setDropletMetadata({
        name: updatedData.scenario_name || '',
        id: updatedData.ID || '',
        description: updatedData.description || '',
        pictureUrl: updatedData.metadata?.image_url || ''
    });
    setSelectedAPIs(updatedData.actions || []);
    setSelectedTriggers(updatedData.triggers || []);
    setSelectedConditions(updatedData.conditions || []);
};


  const handleToggleView = () => {
    setShowTreeView(!showTreeView);
  };

  const handleSelectVehicle = (vehicle) => {
    setSelectedVehicles(prevSelected =>
      prevSelected.includes(vehicle) ? prevSelected.filter(v => v !== vehicle) : [...prevSelected, vehicle]
    );
  };



  const renderDescriptionBox = (item, type, valueInput, isExpanded) => (
    <Fade in={isExpanded}>
      <Box
        sx={{
          position: 'absolute',
          left: '350px', // Adjusted to make sure it aligns with the left pane
          top: '0',
          width: '500px',
          height: '500px',
          backgroundColor: '#2e2e2e',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0px 4px 12px rgba(0,0,0,0.4)',
          zIndex: 10,
          color: '#c5c5c5',
          display: isExpanded ? 'block' : 'none',
        }}
      >
        <Typography variant="body2">Description: {item.description}</Typography>
        <Typography variant="body2">Data Type: {item.dataType}</Typography>
        <Typography variant="body2">UUID: {item.UUID}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Value"
            value={valueInput[item.UUID] || ''}
            onChange={(e) => handleValueChange(type, item.UUID, e.target.value)}
            sx={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
          />
<IconButton
  onClick={() => isItemSelected(type, item.UUID) ? removeItemFromSelected(type, item.UUID) : addItemToSelected(type, item)}
  sx={{ color: '#ffffff', marginLeft: 1 }}
>
  {isItemSelected(type, item.UUID) ? <RemoveIcon /> : <AddIcon />}
</IconButton>
        </Box>
      </Box>
    </Fade>
  );

  const renderMetadataBox = () => (
    <Fade in={isMetadataExpanded}>
      <Box
        sx={{
          position: 'absolute',
          left: '100%', // Adjusts to be next to the metadata button
          top: '0', // Aligns vertically
          width: '350px',
          backgroundColor: '#2e2e2e',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0px 4px 12px rgba(0,0,0,0.4)',
          zIndex: 10,
          color: '#c5c5c5',
          display: isMetadataExpanded ? 'block' : 'none',
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="Droplet Name"
              name="name"
              value={dropletMetadata.name}
              onChange={handleMetadataChange}
              sx={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
            />
          </Grid>
          <Grid item xs={12}>
        <Button variant="contained" fullWidth onClick={() => setIsImageDialogOpen(true)}>
          Select Image
        </Button>
      </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="Description"
              name="description"
              value={dropletMetadata.description}
              onChange={handleMetadataChange}
              sx={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="Droplet ID"
              name="id"
              value={dropletMetadata.id}
              onChange={handleMetadataChange}
              sx={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
            />
          </Grid>
          <ImageSelector
        isOpen={isImageDialogOpen}
        onClose={() => setIsImageDialogOpen(false)}
        onSelectImage={handleImageSelect}
      />
        </Grid>
      </Box>
    </Fade>
  );

  const handleCreateDroplet = async () => {
    // Prepare the droplet data based on the current state
    const dropletData = {
      ID: dropletMetadata.id || "scenario_005",
      Type:"Scenario",
      scenario_name: dropletMetadata.name || "Overspeed Alert",
      description: dropletMetadata.description || "Alerts the driver when the vehicle speed exceeds 80 km/h.",
      version: "1.0",
      created_time: new Date().toISOString(), // use the current time
      updated_time: null,
      "Vehicle Models": selectedVehicles.length > 0 ? selectedVehicles.join(", ") : "Nexon, Harrier",
      triggers: selectedTriggers,
      conditions: selectedConditions,
      actions: selectedAPIs,
      metadata: {
        approval: true,
        staging: false,
        tags: ["safety", "speed", "alert"],
        icon_url: dropletMetadata.pictureUrl || "https://example.com/icons/overspeed_alert.png",
        image_url: dropletMetadata.pictureUrl || null,
        author: "System",
        category: "Safety",
        priority: 1,
        popularity: 75,
        subscription_required: false,
        free: true,
        most_used: true,
        version_history: [],
        scenario_source: "preset",
        scenario_lifecycle: "unlimited",
        scenario_display_config: "visible",
        scenario_type: "system"
      }
    };
  
    try {
      const response = await addDroplet(dropletData);
      
      // Check the response status directly
      if (response || response.status == 201) {
        alert("Droplet created successfully!");
  
        // Reset the form and JSON content
        setDropletMetadata({ name: '', id: '', description: '', pictureUrl: '' });
        setSelectedAPIs([]);
        setSelectedTriggers([]);
        setSelectedConditions([]);
        setSelectedVehicles([]);
        setJsonContent('{}'); // Reset the JSON content
      } else {
        alert("Failed to create droplet. Please try again.");
      }
    } catch (error) {
      console.error("Error creating droplet:", error);
      alert("An error occurred while creating the droplet.");
    }
  };
  

  return (
    <div className="droplet-builder-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#1e1e1e', color: '#d4d4d4' }}>
      <Box sx={{ display: 'flex', flexGrow: 1 }}>


        {/* Side Navigation Pane */}
        <Box sx={{ width: '20%', backgroundColor: '#252526', padding: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" sx={{ color: '#9cdcfe', padding: 1 }}>Droplet Builder</Typography>

          {/* Metadata Section */}
          <Box 
            sx={{ 
              marginBottom: 0, 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
              padding: '8px', 
              backgroundColor: isMetadataExpanded ? '#333' : '#000000', 
              borderRadius: '5px', 
              position: 'relative' // Added relative positioning here
            }}
          >
            <Typography sx={{ flexGrow: 1, color: '#ffffff' }}>Metadata</Typography>
            <IconButton onClick={() => setIsMetadataExpanded(!isMetadataExpanded)} sx={{ color: '#ffffff' }}>
              {isMetadataExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
            </IconButton>

            {renderMetadataBox()} {/* Keep this here */}
          </Box>
          
          {/* Actions Section */}
          <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: '#ffffff' }} />} sx={{ backgroundColor: '#000000', color: '#ffffff' }}>
            <Typography>Actions</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ backgroundColor: '#1e1e1e', color: '#d4d4d4' }}>
            <TextField
              placeholder="Search Actions..."
              value={apiSearch}
              onChange={(e) => setApiSearch(e.target.value)}
              variant="outlined"
              size="small"
              sx={{ backgroundColor: '#ffffff', borderRadius: '4px', width: '100%', marginBottom: '8px' }}
            />
            {filteredAPIs.map(api => (
              <Box key={api.UUID} sx={{ marginBottom: 1, display: 'flex', alignItems: 'center', position: 'relative' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    flexGrow: 1,
                    padding: '8px',
                    borderRadius: '5px',
                    backgroundColor: expandedAPIs[api.UUID] ? '#333' : 'transparent',
                  }}
                  onClick={() => toggleExpansion('api', api.UUID)}
                >
                  <Typography sx={{ flexGrow: 1, color: '#ffffff' }}>{api.API_Name}</Typography>
                  <IconButton sx={{ color: '#ffffff' }}>{expandedAPIs[api.UUID] ? <ChevronDownIcon /> : <ChevronRightIcon />}</IconButton>
                </Box>
                <IconButton onClick={() => isItemSelected('api', api.UUID) ? removeItemFromSelected('api', api.UUID) : addItemToSelected('api', api)} sx={{ color: '#ffffff', marginLeft: 1 }}>
                  {isItemSelected('api', api.UUID) ? <RemoveIcon /> : <AddIcon />}
                </IconButton>
                {renderDescriptionBox(api, 'api', apiValueInput, expandedAPIs[api.UUID])}
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>

          {/* Triggers & Conditions Sections */}
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon style={{ color: '#ffffff' }} />}
              sx={{ backgroundColor: '#000000', color: '#ffffff' }}
            >
              <Typography>Triggers</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: '#1e1e1e', color: '#d4d4d4' }}>
  <TextField
    placeholder="Search Triggers..."
    value={triggerSearch}
    onChange={(e) => setTriggerSearch(e.target.value)}
    variant="outlined"
    size="small"
    sx={{
      backgroundColor: '#ffffff',
      borderRadius: '4px',
      width: '100%',
      marginBottom: '8px',
    }}
  />
  {filteredTriggers.map(trigger => (
    <Box key={trigger.UUID} sx={{ marginBottom: 1, display: 'flex', alignItems: 'center', position: 'relative' }}>
      <Box 
        sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flexGrow: 1, padding: '8px', borderRadius: '5px', backgroundColor: expandedTriggers[trigger.UUID] ? '#333' : 'transparent' }}
        onClick={() => toggleExpansion('trigger', trigger.UUID)}
      >
        <Typography sx={{ flexGrow: 1, color: '#ffffff' }}>{trigger.API_Name}</Typography>
        <IconButton sx={{ color: '#ffffff' }}>
          {expandedTriggers[trigger.vss_signal] ? <ChevronDownIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>
      {/* Add/Remove Button Logic */}
      <IconButton
        onClick={() => isItemSelected('trigger', trigger.UUID) ? removeItemFromSelected('trigger', trigger.UUID) : addItemToSelected('trigger', trigger)}
        sx={{ color: '#ffffff', marginLeft: 1 }}
      >
        {isItemSelected('trigger', trigger.UUID) ? <RemoveIcon /> : <AddIcon />}
      </IconButton>
      {renderDescriptionBox(trigger, 'trigger', triggerValueInput, expandedTriggers[trigger.vss_signal])}
    </Box>
  ))}
</AccordionDetails>

          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon style={{ color: '#ffffff' }} />}
              sx={{ backgroundColor: '#000000', color: '#ffffff' }}
            >
              <Typography>Conditions</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: '#1e1e1e', color: '#d4d4d4' }}>
            <TextField
              placeholder="Search Conditions..."
              value={conditionSearch}
              onChange={(e) => setConditionSearch(e.target.value)}
              variant="outlined"
              size="small"
              sx={{ backgroundColor: '#ffffff', borderRadius: '4px', width: '100%', marginBottom: '8px' }}
            />
              {filteredConditions.map(condition => (
                <Box key={condition.UUID} sx={{ marginBottom: 1, display: 'flex', alignItems: 'center', position: 'relative' }}>
                  <Box 
                    sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flexGrow: 1, padding: '8px', borderRadius: '5px', backgroundColor: expandedConditions[condition.UUID] ? '#333' : 'transparent' }}
                    onClick={() => toggleExpansion('condition', condition.UUID)}
                  >
                    <Typography sx={{ flexGrow: 1, color: '#ffffff' }}>{condition.API_Name}</Typography>
                    <IconButton sx={{ color: '#ffffff' }}>
                      {expandedConditions[condition.UUID] ? <ChevronDownIcon /> : <ChevronRightIcon />}
                    </IconButton>
                  </Box>
                  {renderDescriptionBox(condition, 'condition', conditionValueInput, expandedConditions[condition.UUID])}
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
        </Box>
       

{/* JSON Viewer and Tree Visualization */}
{/* JSON Viewer and Tree Visualization */}
<Box
  sx={{
    width: showTreeView ? '55%' : '55%',
    height: showTreeView ? '100vh' : 'auto',
    padding: showTreeView ? 0 : 2,
    backgroundColor: '#1e1e1e',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: showTreeView ? 'relative' : 'static',
  }}
>
  
  {/* Toggle Button to switch views */}
  <Box sx={{ width: '55%', padding: 2, backgroundColor: '#1e1e1e', display: 'flex', flexDirection: 'column' }}>
    <FormControlLabel
      control={<Switch checked={showTreeView} onChange={handleToggleView} />}
      label={showTreeView ? "Tree View" : "JSON View"}
      sx={{
        color: '#ffffff',
      }}
    />
  </Box>

  {/* Conditionally Render JSON Viewer or Tree */}
  {!showTreeView ? (
    <Box sx={{ width: '100%', height: 'auto', padding: 2 }}>
      <ReactJson
        src={JSON.parse(jsonContent)}
        theme="monokai"
        iconStyle="square"
        style={{ backgroundColor: '#1e1e1e', padding: '10px', fontFamily: 'monospace' }}
        onEdit={handleJsonEdit}
        onAdd={handleJsonEdit}
        onDelete={handleJsonEdit}
      />
    </Box>
  ) : (
    <Box sx={{ width: '100%', height: '100vh' }}>
      <Tree
        data={jsonToTree(JSON.parse(jsonContent))}
        orientation="horizontal"
        translate={{ x: 200, y: 300 }}
        collapsible={true}
        pathFunc="diagonal"
        rootNodeClassName="node__root"
        branchNodeClassName="node__branch"
        leafNodeClassName="node__leaf"
        pathClassFunc={() => 'link__base'} 
      />
    </Box>
  )}
  

    {/* Add Create Droplet Button */}
    <Box sx={{ marginTop: 3 }}>
    <button className="p-[3px] relative" 
        onClick={isEditMode ? handleSubmitDroplet : handleCreateDroplet}>
    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
    <div className="px-8 py-2 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
        {isEditMode ? 'Edit Droplet' : 'Create Droplet'}
    </div>
</button>

</Box>
</Box>

<Box sx={{  width: '25%', backgroundColor: '#2a2a2a', display: 'flex', flexDirection: 'column', padding: 1 }}>
          {/* Top Card - Droplet Image, Name, Description */}
          <Box
  sx={{
    position: 'relative',
    borderRadius: '10px', // Matching the card border radius
    padding: '4px', // Space for the gradient border
    background: 'linear-gradient(90deg, #667eea, #764ba2)', // Gradient similar to the button
    backgroundSize: '200% 200%',
    animation: 'gradientAnimation 5s infinite linear',
    marginBottom: '16px',
    
  }}
>
  <Card
    sx={{
      height: '300px',
      paddingBottom:'1px',
    backgroundColor: '#ffffff', // Changed to white background
    color: '#000000',
      borderRadius: '8px', // Adjust to be slightly smaller than the box radius
      overflow: 'hidden', // Ensure content stays within the card
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': {
        transform: 'scale(1.03)',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.6)',
      },
    }}
  >
    <CardContent>
      <img
        src={dropletMetadata.pictureUrl}
        alt="Droplet Preview"
        style={{
          width: '60%', // Set image width to 70% of the card
          height: '50%', // Set image height to 70% of the card
          objectFit: 'contain', // Maintain image aspect ratio
          borderRadius: '5px',
          marginBottom: '10px',
          marginLeft:'60px', // Add space between image and text
          
        }}
      />
      <Typography variant="h6">{dropletMetadata.name}</Typography>
      <Typography variant="body2">{dropletMetadata.description}</Typography>
    </CardContent>
  </Card>
  <style>
    {`
    @keyframes gradientAnimation {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    `}
  </style>
</Box>





          {/* Bottom Card - Tree with Specific Data */}
<Box sx={{
    position: 'relative',
    borderRadius: '10px', // Matching the card border radius
    padding: '4px', // Space for the gradient border
    background: 'linear-gradient(19deg, #21D4FD 0%, #B721FF 100%)',
    backgroundSize: '400% 400%',
    animation:  'gradientAnimation 6s ease infinite',
}}>
    <Card sx={{ 
        flexGrow: 1, 
        backgroundColor: '#333',
        color: '#ffffff',
        borderRadius: '10px',
        overflow: 'hidden', // Ensure content stays within the card
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
            transform: 'scale(1.03)',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.6)'
        },
    }}>
        <CardContent>
            <Typography variant="h6" gutterBottom>Actions, Triggers, Conditions</Typography>
            <Box sx={{ width: '100%', height: '60vh' }}>
                <Tree
                    data={getDynamicTreeData()}
                    orientation="vertical"
                    translate={{ x: 100, y: 50 }}
                    pathFunc="step"
                    rootNodeClassName="node__root"
                    branchNodeClassName="node__branch"
                    leafNodeClassName="node__leaf"
                    pathClassFunc={() => 'link__base'} 
                />
            </Box>
        </CardContent>
    </Card>
    <style>
        {`
        @keyframes gradientAnimation {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        `}
    </style>
</Box>

        </Box>



      </Box>
     
      
    </div>
  );
};

export default DropletBuilder;
