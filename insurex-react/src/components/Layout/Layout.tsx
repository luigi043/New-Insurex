import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Box, Drawer, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PolicyIcon from '@mui/icons-material/Policy';
import InventoryIcon from '@mui/icons-material/Inventory';
import DescriptionIcon from '@mui/icons-material/Description';
import AssessmentIcon from '@mui/icons-material/Assessment';

const drawerWidth = 240;

export const Layout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            InsureX Platform
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem button component={Link} to="/dashboard">
              <ListItemIcon><DashboardIcon /></ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button component={Link} to="/policies">
              <ListItemIcon><PolicyIcon /></ListItemIcon>
              <ListItemText primary="Policies" />
            </ListItem>
            <ListItem button component={Link} to="/assets">
              <ListItemIcon><InventoryIcon /></ListItemIcon>
              <ListItemText primary="Assets" />
            </ListItem>
            <ListItem button component={Link} to="/claims">
              <ListItemIcon><DescriptionIcon /></ListItemIcon>
              <ListItemText primary="Claims" />
            </ListItem>
            <ListItem button component={Link} to="/reports">
              <ListItemIcon><AssessmentIcon /></ListItemIcon>
              <ListItemText primary="Reports" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};
