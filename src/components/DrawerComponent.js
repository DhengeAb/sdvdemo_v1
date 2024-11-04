import React from 'react';
import { Drawer, Toolbar, Box, List, ListItem, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { Menu as MenuIcon, ChevronLeft as ChevronLeftIcon, Dashboard as DashboardIcon, Storage as StorageIcon } from '@mui/icons-material';

const DrawerComponent = ({ drawerOpen, toggleDrawer, drawerWidthExpanded, drawerWidthCollapsed }) => (
  <Drawer
    variant="permanent"
    sx={{
      width: drawerOpen ? drawerWidthExpanded : drawerWidthCollapsed,
      flexShrink: 0,
      [`& .MuiDrawer-paper`]: {
        width: drawerOpen ? drawerWidthExpanded : drawerWidthCollapsed,
        boxSizing: 'border-box',
        backgroundColor: '#1c1c1e',
        color: '#000',
      },
    }}
  >
    <Toolbar sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '64px' }}>
      <IconButton onClick={toggleDrawer} sx={{ color: '#fff' }}>
        {drawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
      </IconButton>
    </Toolbar>
    <Box sx={{ overflow: 'auto' }}>
      <List>
        <ListItem button component={Link} to="/">
          <ListItemIcon sx={{ color: '#fff' }}>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Droplet Builder" sx={{ color: '#fff' }} />
        </ListItem>
        <ListItem button component={Link} to="/view-droplets">
          <ListItemIcon sx={{ color: '#fff' }}>
            <StorageIcon />
          </ListItemIcon>
          <ListItemText primary="View Droplets" sx={{ color: '#fff'  }} />
        </ListItem>
      </List>
    </Box>
  </Drawer>
);

export default DrawerComponent;