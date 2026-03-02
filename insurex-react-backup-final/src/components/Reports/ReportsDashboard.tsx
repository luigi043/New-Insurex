import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import { GetApp } from '@mui/icons-material';
import { reportService } from '../../services/report.service';

export const ReportsDashboard: React.FC = () => {
  const [reportType, setReportType] = useState('policies');
  const [period, setPeriod] = useState('month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const reports = [
    { title: 'Uninsured Assets Report', type: 'uninsured' },
    { title: 'Expiring Policies Report', type: 'expiring' },
    { title: 'Monthly Transactions Report', type: 'transactions' },
    { title: 'Reinstated Cover Report', type: 'reinstated' },
    { title: 'Claims Summary', type: 'claims-summary' },
    { title: 'Premium Collection', type: 'premiums' },
  ];

  const handleExport = async (type: string) => {
    try {
      const params: any = { format: 'csv' };
      if (startDate) params.from = startDate;
      if (endDate) params.to = endDate;
      
      const response = await reportService.exportReport(type, params);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Reports Dashboard</Typography>

      <Grid container spacing={3}>
        {/* Report Filters */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Report Filters</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Period</InputLabel>
                  <Select
                    value={period}
                    label="Period"
                    onChange={(e) => setPeriod(e.target.value)}
                  >
                    <MenuItem value="week">Last 7 Days</MenuItem>
                    <MenuItem value="month">Last 30 Days</MenuItem>
                    <MenuItem value="quarter">Last 3 Months</MenuItem>
                    <MenuItem value="year">Last 12 Months</MenuItem>
                    <MenuItem value="custom">Custom Range</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {period === 'custom' && (
                <>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Start Date"
                      InputLabelProps={{ shrink: true }}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      type="date"
                      label="End Date"
                      InputLabelProps={{ shrink: true }}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </Paper>
        </Grid>

        {/* Report Cards */}
        {reports.map((report) => (
          <Grid item xs={12} md={6} lg={4} key={report.type}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {report.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Generate and export {report.title.toLowerCase()} in CSV format
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<GetApp />}
                  onClick={() => handleExport(report.type)}
                  fullWidth
                >
                  Export CSV
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};