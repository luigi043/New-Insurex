import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
} from '@mui/material';
import {
  DirectionsCar,
  Home,
  Sailboat,
  Flight,
  Inventory,
  Receipt,
  PrecisionManufacturing,
  Factory,
  BusinessCenter,
  Person,
  Computer,
} from '@mui/icons-material';

const assetTypes = [
  { name: 'Vehicle', icon: <DirectionsCar sx={{ fontSize: 40 }} />, color: '#1976d2' },
  { name: 'Property', icon: <Home sx={{ fontSize: 40 }} />, color: '#2e7d32' },
  { name: 'Watercraft', icon: <Sailboat sx={{ fontSize: 40 }} />, color: '#0077be' },
  { name: 'Aviation', icon: <Flight sx={{ fontSize: 40 }} />, color: '#9c27b0' },
  { name: 'Stock Inventory', icon: <Inventory sx={{ fontSize: 40 }} />, color: '#ed6c02' },
  { name: 'Accounts Receivable', icon: <Receipt sx={{ fontSize: 40 }} />, color: '#d32f2f' },
  { name: 'Machinery', icon: <PrecisionManufacturing sx={{ fontSize: 40 }} />, color: '#8d6e63' },
  { name: 'Plant Equipment', icon: <Factory sx={{ fontSize: 40 }} />, color: '#4caf50' },
  { name: 'Business Interruption', icon: <BusinessCenter sx={{ fontSize: 40 }} />, color: '#ff9800' },
  { name: 'Keyman Insurance', icon: <Person sx={{ fontSize: 40 }} />, color: '#795548' },
  { name: 'Electronic Equipment', icon: <Computer sx={{ fontSize: 40 }} />, color: '#607d8b' },
];

export const AssetTypeSelector: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Select Asset Type</Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Choose the type of asset you want to create
      </Typography>

      <Grid container spacing={3}>
        {assetTypes.map((type) => (
          <Grid item xs={12} sm={6} md={4} key={type.name}>
            <Card>
              <CardActionArea
                onClick={() => navigate(`/assets/new/${type.name.replace(' ', '')}`)}
              >
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Box sx={{ color: type.color, mb: 2 }}>
                    {type.icon}
                  </Box>
                  <Typography variant="h6">
                    {type.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};