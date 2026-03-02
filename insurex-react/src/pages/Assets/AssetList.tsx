import React, { useState, useEffect } from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Typography, FormControl, InputLabel, Select, MenuItem, Grid, Card, CardContent } from '@mui/material';
import { assetService } from '../services/asset.service';
import { AssetType } from '../types/asset.types';

export const AssetList: React.FC = () => {
  const [assets, setAssets] = useState<any[]>([]);
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    assetService.getAssets(1, 10, typeFilter || undefined).then(r => setAssets(r.items));
  }, [typeFilter]);

  const stats = {
    total: assets.length,
    totalValue: assets.reduce((s, a) => s + a.value, 0)
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Assets</Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6}><Card><CardContent><Typography color="textSecondary">Total Assets</Typography><Typography variant="h5">{stats.total}</Typography></CardContent></Card></Grid>
        <Grid item xs={6}><Card><CardContent><Typography color="textSecondary">Total Value</Typography><Typography variant="h5">${stats.totalValue.toLocaleString()}</Typography></CardContent></Card></Grid>
      </Grid>
      <Paper sx={{ p: 2, mb: 2 }}>
        <FormControl fullWidth size="small"><InputLabel>Asset Type</InputLabel>
          <Select value={typeFilter} label="Asset Type" onChange={(e) => setTypeFilter(e.target.value)}>
            <MenuItem value="">All Types</MenuItem>
            {Object.values(AssetType).map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </Select>
        </FormControl>
      </Paper>
      <TableContainer component={Paper}>
        <Table><TableHead><TableRow><TableCell>Name</TableCell><TableCell>Type</TableCell><TableCell>Value</TableCell><TableCell>Location</TableCell><TableCell>Status</TableCell></TableRow></TableHead>
        <TableBody>{assets.map(a => (
          <TableRow key={a.id}><TableCell>{a.name}</TableCell><TableCell>{a.type}</TableCell><TableCell>${a.value.toLocaleString()}</TableCell><TableCell>{a.location}</TableCell>
            <TableCell><Chip label={a.status} color={a.status === 'Active' ? 'success' : 'default'} size="small" /></TableCell>
          </TableRow>
        ))}</TableBody></Table>
      </TableContainer>
    </Box>
  );
};
