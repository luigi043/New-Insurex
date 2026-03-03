import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Divider,
} from '@mui/material';
import {
  Assessment,
  PictureAsPdf,
  TableChart,
  Schedule,
  Email,
  Download,
  Visibility,
  Delete,
  Edit,
  Add,
  DragIndicator,
} from '@mui/icons-material';
import { reportService } from '../../services/report.service';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface PredefinedReport {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
}

export const ReportGenerator: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);

  // Custom Report State
  const [reportConfig, setReportConfig] = useState({
    name: '',
    description: '',
    reportType: 'policy',
    dateRange: 'last30days',
    startDate: '',
    endDate: '',
    groupBy: 'status',
    filters: [] as string[],
    columns: [] as string[],
    chartType: 'bar',
  });

  // Predefined Reports
  const predefinedReports: PredefinedReport[] = [
    {
      id: 'policy-summary',
      name: 'Policy Summary Report',
      description: 'Overview of all policies with key metrics',
      category: 'Policies',
      icon: <Assessment />,
    },
    {
      id: 'claims-analysis',
      name: 'Claims Analysis',
      description: 'Detailed analysis of claims by status and type',
      category: 'Claims',
      icon: <Assessment />,
    },
    {
      id: 'premium-revenue',
      name: 'Premium Revenue Report',
      description: 'Revenue breakdown by policy type and period',
      category: 'Financial',
      icon: <Assessment />,
    },
    {
      id: 'expiring-policies',
      name: 'Expiring Policies',
      description: 'Policies expiring in the next 30/60/90 days',
      category: 'Policies',
      icon: <Schedule />,
    },
    {
      id: 'client-portfolio',
      name: 'Client Portfolio',
      description: 'Client-wise policy and premium summary',
      category: 'Clients',
      icon: <Assessment />,
    },
    {
      id: 'loss-ratio',
      name: 'Loss Ratio Analysis',
      description: 'Claims vs premiums analysis',
      category: 'Financial',
      icon: <Assessment />,
    },
  ];

  // Available columns for different report types
  const availableColumns: Record<string, string[]> = {
    policy: [
      'Policy Number',
      'Client Name',
      'Policy Type',
      'Status',
      'Premium Amount',
      'Start Date',
      'End Date',
      'Coverage Amount',
    ],
    claim: [
      'Claim Number',
      'Policy Number',
      'Claim Type',
      'Status',
      'Claimed Amount',
      'Approved Amount',
      'Incident Date',
      'Reported Date',
    ],
    financial: [
      'Period',
      'Premium Collected',
      'Claims Paid',
      'Outstanding Premium',
      'Loss Ratio',
      'Profit/Loss',
    ],
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleGeneratePredefined = async (reportId: string, format: 'pdf' | 'excel') => {
    setLoading(true);
    try {
      const response = await reportService.generatePredefinedReport(reportId, format);
      // Download the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportId}.${format === 'pdf' ? 'pdf' : 'xlsx'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCustom = async (format: 'pdf' | 'excel') => {
    setLoading(true);
    try {
      const response = await reportService.generateCustomReport(reportConfig, format);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportConfig.name || 'custom-report'}.${format === 'pdf' ? 'pdf' : 'xlsx'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to generate custom report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleColumnToggle = (column: string) => {
    const currentIndex = reportConfig.columns.indexOf(column);
    const newColumns = [...reportConfig.columns];

    if (currentIndex === -1) {
      newColumns.push(column);
    } else {
      newColumns.splice(currentIndex, 1);
    }

    setReportConfig({ ...reportConfig, columns: newColumns });
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Report Generator
        </Typography>
        <Typography color="textSecondary">
          Generate comprehensive reports for policies, claims, and financial data
        </Typography>
      </Box>

      <Paper>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Predefined Reports" />
          <Tab label="Custom Report Builder" />
          <Tab label="Scheduled Reports" />
          <Tab label="Email Reports" />
        </Tabs>

        {/* Predefined Reports Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {predefinedReports.map((report) => (
              <Grid item xs={12} md={6} lg={4} key={report.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ mr: 2, color: 'primary.main' }}>
                        {report.icon}
                      </Box>
                      <Box>
                        <Typography variant="h6">{report.name}</Typography>
                        <Chip label={report.category} size="small" />
                      </Box>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      {report.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      startIcon={<PictureAsPdf />}
                      onClick={() => handleGeneratePredefined(report.id, 'pdf')}
                      disabled={loading}
                    >
                      PDF
                    </Button>
                    <Button
                      size="small"
                      startIcon={<TableChart />}
                      onClick={() => handleGeneratePredefined(report.id, 'excel')}
                      disabled={loading}
                    >
                      Excel
                    </Button>
                    <Button size="small" startIcon={<Visibility />}>
                      Preview
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Custom Report Builder Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper variant="outlined" sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Report Configuration
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Report Name"
                      value={reportConfig.name}
                      onChange={(e) => setReportConfig({ ...reportConfig, name: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Description"
                      value={reportConfig.description}
                      onChange={(e) => setReportConfig({ ...reportConfig, description: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Report Type</InputLabel>
                      <Select
                        value={reportConfig.reportType}
                        label="Report Type"
                        onChange={(e) => setReportConfig({ ...reportConfig, reportType: e.target.value, columns: [] })}
                      >
                        <MenuItem value="policy">Policies</MenuItem>
                        <MenuItem value="claim">Claims</MenuItem>
                        <MenuItem value="financial">Financial</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Date Range</InputLabel>
                      <Select
                        value={reportConfig.dateRange}
                        label="Date Range"
                        onChange={(e) => setReportConfig({ ...reportConfig, dateRange: e.target.value })}
                      >
                        <MenuItem value="today">Today</MenuItem>
                        <MenuItem value="last7days">Last 7 Days</MenuItem>
                        <MenuItem value="last30days">Last 30 Days</MenuItem>
                        <MenuItem value="last90days">Last 90 Days</MenuItem>
                        <MenuItem value="thisMonth">This Month</MenuItem>
                        <MenuItem value="lastMonth">Last Month</MenuItem>
                        <MenuItem value="thisYear">This Year</MenuItem>
                        <MenuItem value="custom">Custom Range</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  {reportConfig.dateRange === 'custom' && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          type="date"
                          label="Start Date"
                          value={reportConfig.startDate}
                          onChange={(e) => setReportConfig({ ...reportConfig, startDate: e.target.value })}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          type="date"
                          label="End Date"
                          value={reportConfig.endDate}
                          onChange={(e) => setReportConfig({ ...reportConfig, endDate: e.target.value })}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    </>
                  )}
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Group By</InputLabel>
                      <Select
                        value={reportConfig.groupBy}
                        label="Group By"
                        onChange={(e) => setReportConfig({ ...reportConfig, groupBy: e.target.value })}
                      >
                        <MenuItem value="status">Status</MenuItem>
                        <MenuItem value="type">Type</MenuItem>
                        <MenuItem value="date">Date</MenuItem>
                        <MenuItem value="client">Client</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Chart Type</InputLabel>
                      <Select
                        value={reportConfig.chartType}
                        label="Chart Type"
                        onChange={(e) => setReportConfig({ ...reportConfig, chartType: e.target.value })}
                      >
                        <MenuItem value="bar">Bar Chart</MenuItem>
                        <MenuItem value="line">Line Chart</MenuItem>
                        <MenuItem value="pie">Pie Chart</MenuItem>
                        <MenuItem value="table">Table Only</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Select Columns
                  </Typography>
                  <List>
                    {availableColumns[reportConfig.reportType]?.map((column) => (
                      <ListItem
                        key={column}
                        dense
                        button
                        onClick={() => handleColumnToggle(column)}
                      >
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            checked={reportConfig.columns.indexOf(column) !== -1}
                            tabIndex={-1}
                            disableRipple
                          />
                        </ListItemIcon>
                        <ListItemText primary={column} />
                        <IconButton size="small">
                          <DragIndicator />
                        </IconButton>
                      </ListItem>
                    ))}
                  </List>
                </Box>

                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<PictureAsPdf />}
                    onClick={() => handleGenerateCustom('pdf')}
                    disabled={loading || !reportConfig.name || reportConfig.columns.length === 0}
                  >
                    Generate PDF
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<TableChart />}
                    onClick={() => handleGenerateCustom('excel')}
                    disabled={loading || !reportConfig.name || reportConfig.columns.length === 0}
                  >
                    Generate Excel
                  </Button>
                  <Button variant="outlined" startIcon={<Visibility />}>
                    Preview
                  </Button>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper variant="outlined" sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Report Preview
                </Typography>
                <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1 }}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Name: {reportConfig.name || 'Untitled Report'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Type: {reportConfig.reportType}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Columns: {reportConfig.columns.length} selected
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="caption" color="textSecondary">
                    Selected Columns:
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {reportConfig.columns.map((col) => (
                      <Chip key={col} label={col} size="small" sx={{ m: 0.5 }} />
                    ))}
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Scheduled Reports Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Schedule sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Scheduled Reports
            </Typography>
            <Typography color="textSecondary" paragraph>
              Set up automatic report generation on a schedule
            </Typography>
            <Button variant="contained" startIcon={<Add />}>
              Create Schedule
            </Button>
          </Box>
        </TabPanel>

        {/* Email Reports Tab */}
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Email sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Email Reports
            </Typography>
            <Typography color="textSecondary" paragraph>
              Configure automatic email delivery of reports
            </Typography>
            <Button variant="contained" startIcon={<Add />}>
              Setup Email Report
            </Button>
          </Box>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default ReportGenerator;
