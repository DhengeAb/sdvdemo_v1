import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import AppBarComponent from './components/AppBarComponents';
import DrawerComponent from './components/DrawerComponent';
import DropletBuilder from './components/DropletBuilder';
import ViewDroplets from './components/ViewDroplets';
import Login from './components/Login';
import EditDropletBuilder from './components/EditDropletBuilder'; // Import the new Edit Component
import { vehicleAPIs } from './Data/VehicleAPIs';
import { addDroplet } from './Data/storedDroplets';

const App = () => {
    const [selectedAPIs, setSelectedAPIs] = useState([]);
    const [selectedVehicles, setSelectedVehicles] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(true);
    const [dropletMetadata, setDropletMetadata] = useState({
        name: '',
        id: '',
        description: '',
        pictureUrl: ''
    });
    const [loggedInUser, setLoggedInUser] = useState(null);

    // Check localStorage to persist login
    useEffect(() => {
        const storedUser = localStorage.getItem('loggedInUser');
        if (storedUser) {
            setLoggedInUser(storedUser);
        }
    }, []);

    const handleLogin = (username) => {
        setLoggedInUser(username);
    };

    const handleLogout = () => {
        localStorage.removeItem('loggedInUser');
        setLoggedInUser(null);
    };

    const handleMetadataChange = (e) => {
        const { name, value } = e.target;
        setDropletMetadata(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSelectAPI = (api) => {
        setSelectedAPIs(prevSelected => (!prevSelected.includes(api.name) ? [...prevSelected, api.name] : prevSelected));
    };

    const handleSelectVehicle = (vehicle) => {
        setSelectedVehicles(prevSelected =>
            prevSelected.includes(vehicle) ? prevSelected.filter(v => v !== vehicle) : [...prevSelected, vehicle]
        );
    };

    const handleCreateDroplet = () => {
        const finalDropletJson = {
            metadata: dropletMetadata,
            commands: selectedAPIs,
            vehicles: selectedVehicles
        };
        addDroplet(finalDropletJson);
        alert('Droplet created successfully');
    };

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const vehicles = ['Vehicle 1', 'Vehicle 2', 'Vehicle 3'];

    return (
        <Router>
            {loggedInUser ? (
                <Box sx={{ display: 'flex' }}>
                    <AppBarComponent
                        drawerOpen={drawerOpen}
                        drawerWidthExpanded={240}
                        drawerWidthCollapsed={60}
                        onLogout={handleLogout}
                    />
                    <DrawerComponent
                        drawerOpen={drawerOpen}
                        toggleDrawer={toggleDrawer}
                        drawerWidthExpanded={240}
                        drawerWidthCollapsed={60}
                    />
                    <Box component="main" sx={{ flexGrow: 1, p: 0, pt: 0 }}>
                        <Toolbar />
                        <Routes>
                            <Route
                                exact path="/"
                                element={
                                    <DropletBuilder
                                        dropletMetadata={dropletMetadata}
                                        handleMetadataChange={handleMetadataChange}
                                        vehicles={vehicles}
                                        selectedVehicles={selectedVehicles}
                                        handleSelectVehicle={handleSelectVehicle}
                                        vehicleAPIs={vehicleAPIs}
                                        selectedAPIs={selectedAPIs}
                                        handleSelectAPI={handleSelectAPI}
                                        handleCreateDroplet={handleCreateDroplet}
                                    />
                                }
                            />
                            <Route path="/view-droplets" element={<ViewDroplets />} />
                            <Route path="/build-droplet" element={<DropletBuilder />} />
                        </Routes>
                    </Box>
                </Box>
            ) : (
                <Login onLogin={handleLogin} />
            )}
        </Router>
    );
};

export default App;
