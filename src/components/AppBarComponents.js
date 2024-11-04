import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Avatar, TextField, InputAdornment, Box, Modal } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { vehicleAPIs } from '../Data/VehicleAPIs'; // Adjust path as necessary
import CloseIcon from '@mui/icons-material/Close';  // Import Close Icon




const AppBarComponent = ({ drawerOpen, drawerWidthExpanded, drawerWidthCollapsed, onLogout, toggleDrawer,showSearchBar }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [filteredAPIs, setFilteredAPIs] = useState([]);
  const [selectedApi, setSelectedApi] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [fetchedAPIs, setFetchedAPIs] = useState([]); // To store fetched APIs

  const [hoverStyle, setHoverStyle] = useState({});

  const handleMouseEnter = () => {
    setHoverStyle({ boxShadow: '0px 8px 16px rgba(0,0,0,0.2)' }); // Example hover style
  };

  const handleMouseLeave = () => {
    setHoverStyle({});
  };

  useEffect(() => {
    const fetchScenarioActions = async () => {
        try {
            const response = await fetch("https://vrg3y88804.execute-api.ap-south-1.amazonaws.com/dev/Scenario-Actions");
            if (!response.ok) throw new Error('Failed to fetch scenario actions');
            const data = await response.json();
            const allItems = [...data.body[0].actions, ...data.body[0].conditions]; // Adjust according to your needs
            setFetchedAPIs(allItems);
        } catch (error) {
            console.error("Error fetching scenario actions:", error);
        }
    };

    fetchScenarioActions();
}, []);


  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    onLogout();
  };

  const handleSearchInput = (e) => {
    const input = e.target.value;
    setSearchInput(input);
    if (input.length > 0) {
      const filtered = fetchedAPIs.filter(api => api.API_Name.toLowerCase().includes(input.toLowerCase()));
      setFilteredAPIs(filtered);
    } else {
      setFilteredAPIs([]);
    }
  };

  const handleApiSelect = (api) => {
    setSelectedApi(api);
    setOpenModal(true);
    setSearchInput('');
    setFilteredAPIs([]);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedApi(null);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerOpen ? drawerWidthExpanded : drawerWidthCollapsed}px)`,
          ml: `${drawerOpen ? drawerWidthExpanded : drawerWidthCollapsed}px`,
          backgroundColor: '#1c1c1e',
          color: '#ffffff',
          boxShadow: '0px 4px 10px rgba(0,0,0,0.3)',
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>

          <Typography variant="h6" noWrap component="div">
            Droplet Builder
          </Typography>

          {/* Centered Search Bar */}
          {showSearchBar && (
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
              <TextField
                placeholder="Search APIs..."
                value={searchInput}
                onChange={handleSearchInput}
                variant="outlined"
                size="small"
                sx={{
                  backgroundColor: '#ffffff',
                  borderRadius: '4px',
                  width: '300px',
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          )}

          <IconButton onClick={handleLogout} color="inherit">
            <Avatar sx={{ bgcolor: '#2e2e2e' }}>
              <AccountCircleIcon />
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Modal to display API details */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box
          sx={{
            width: '500px', // More square shape
            height:'500px',
            backgroundColor: '#ffffff', // White background
            padding: 3,
            borderRadius: '10px',
            boxShadow: '0px 4px 10px rgba(0,0,0,0.3)',
            position: 'relative', // Needed for absolute positioning of the close button
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={hoverStyle}
        >
          <IconButton
            onClick={handleCloseModal}
            sx={{ position: 'absolute', top: 8, right: 8, color: 'black' }} // Close button styling
          >
            <CloseIcon />
          </IconButton>
          {selectedApi && (
            <>
              <Typography id="modal-title" variant="h6" sx={{ color: 'black', mb: 2 }}>
                {selectedApi.API_Name}
              </Typography>
              <Typography id="modal-description" variant="body1" sx={{ mb: 2 }}>
                {selectedApi.vss_signal || 'No description available.'}
              </Typography>
              <Typography id="modal-description" variant="body1" sx={{ mb: 2 }}>
                {selectedApi.description || 'No description available.'}
              </Typography>
              <Typography variant="body2">UUID: {selectedApi.UUID}</Typography>
            </>
          )}
        </Box>
      </Modal>

      {/* Display centered search results dropdown */}
      {filteredAPIs.length > 0 && (
        <Box sx={{
          position: 'absolute',
          top: '70px', // Slightly below the AppBar
          left: '50%',
          transform: 'translateX(-50%)', // Center horizontally
          backgroundColor: '#1e1e1e',
          color: '#ffffff',
          width: '300px',
          borderRadius: '5px',
          boxShadow: '0px 4px 12px rgba(0,0,0,0.3)',
          zIndex: 10,
        }}>
          {filteredAPIs.map(api => (
            <MenuItem key={api.UUID} onClick={() => handleApiSelect(api)}>
              {api.API_Name}
            </MenuItem>
          ))}
        </Box>
      )}
    </>
  );
};

export default AppBarComponent;
