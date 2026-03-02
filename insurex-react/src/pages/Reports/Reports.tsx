import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Button } from '@mui/material';
import { Download, BarChart, PieChart, TrendingUp } from '@mui/icons-material';

export const Reports: React.FC = () => {
  const reports = [
    { title: 'Policy Report', description: 'Overview of all policies by type, status, and value', icon: BarChart },
    { title: 'Claims Report', description: 'Claims analysis by status, type, and settlement time', icon: PieChart },
    { title: 'Financial Report', description: 'Revenue, premiums, and payments summary', icon: TrendingUp },
    { title: 'Asset Report', description: 'Asset inventory and valuation report', icon: BarChart },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Reports</Typography>
      <Grid container spacing={3}>
        {reports.map((report, index) => {
          const Icon = report.icon;
          return (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Icon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">{report.title}</Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    {report.description}
                  </Typography>
                  <Button variant="outlined" size="small" startIcon={<Download />} fullWidth>
                    Download
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
