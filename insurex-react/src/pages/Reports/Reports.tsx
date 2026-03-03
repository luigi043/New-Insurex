import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Download,
  PictureAsPdf,
  TableChart,
  BarChart,
  TrendingUp,
  TrendingDown,
  AttachMoney,
  Assignment,
  Warning,
  CalendarToday,
  Build,
  LibraryBooks,
  Schedule,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import { useReports } from '../../hooks/useReports';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useNotification } from '../../hooks/useNotification';
import { ReportBuilder } from './ReportBuilder';
import { ReportLibrary } from './ReportLibrary';
import { ScheduledReports } from './ScheduledReports';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index} aria-labelledby={`report-tab-${index}`}>
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const reportTypes = [
  { value: 'financial', label: 'Financial' },
  { value: 'policies', label: 'Policies' },
  { value: 'claims', label: 'Claims' },
  { value: 'assets', label: 'Assets' },
  { value: 'partners', label: 'Partners' },
];

const periodOptions = [
  { value: 'current_month', label: 'Current Month' },
  { value: 'last_month', label: 'Last Month' },
  { value: 'current_quarter', label: 'Current Quarter' },
  { value: 'last_quarter', label: 'Last Quarter' },
  { value: 'current_year', label: 'Current Year' },
  { value: 'last_year', label: 'Last Year' },
  { value: 'custom', label: 'Custom Period' },
];

export const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [reportTab, setReportTab] = useState(0);
  const [reportType, setReportType] = useState('financial');
  const [period, setPeriod] = useState('current_month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { showSuccess, showError } = useNotification();

  const {
    financialReport,
    policiesReport,
    claimsReport,
    loading,
    error,
    generateReport,
    exportReport,
  } = useReports();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleReportTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setReportTab(newValue);
  };

  const handleGenerateReport = async () => {
    try {
      await generateReport({
        type: reportType,
        period,
        startDate: period === 'custom' ? startDate : undefined,
        endDate: period === 'custom' ? endDate : undefined,
      });
      showSuccess('Report generated successfully!');
    } catch {
      showError('Failed to generate report');
    }
  };

  const handleExport = async (format: 'pdf' | 'excel') => {
    try {
      await exportReport({ type: reportType, format });
      showSuccess(`Report exported as ${format.toUpperCase()}!`);
    } catch {
      showError('Failed to export report');
    }
  };

  const renderReportGenerator = () => (
    <Box>
      {/* Export Buttons */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button variant="outlined" startIcon={<TableChart />} onClick={() => handleExport('excel')}>
          Excel
        </Button>
        <Button variant="outlined" startIcon={<PictureAsPdf />} onClick={() => handleExport('pdf')}>
          PDF
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Filters</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Report Type</InputLabel>
              <Select value={reportType} label="Report Type" onChange={(e) => setReportType(e.target.value)}>
                {reportTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Period</InputLabel>
              <Select value={period} label="Period" onChange={(e) => setPeriod(e.target.value)}>
                {periodOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleGenerateReport}
              disabled={loading}
              sx={{ height: '56px' }}
            >
              {loading ? <CircularProgress size={24} /> : 'Generate Report'}
            </Button>
          </Grid>
          {period === 'custom' && (
            <>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Start Date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="End Date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </>
          )}
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}

      {/* Report Content Tabs */}
      <Paper>
        <Tabs value={reportTab} onChange={handleReportTabChange}>
          <Tab icon={<BarChart />} label="Overview" id="report-tab-0" />
          <Tab icon={<AttachMoney />} label="Financial" id="report-tab-1" />
          <Tab icon={<Assignment />} label="Policies" id="report-tab-2" />
          <Tab icon={<Warning />} label="Claims" id="report-tab-3" />
        </Tabs>

        <TabPanel value={reportTab} index={0}>
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" variant="body2">Total Policies</Typography>
                    <Typography variant="h4">{policiesReport?.totalPolicies || 0}</Typography>
                    <Typography variant="caption" color="success.main">
                      <TrendingUp fontSize="small" /> +12% vs last period
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" variant="body2">Total Premiums</Typography>
                    <Typography variant="h4">{formatCurrency(financialReport?.totalPremiums || 0)}</Typography>
                    <Typography variant="caption" color="success.main">
                      <TrendingUp fontSize="small" /> +8% vs last period
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" variant="body2">Claims</Typography>
                    <Typography variant="h4">{claimsReport?.totalClaims || 0}</Typography>
                    <Typography variant="caption" color="error.main">
                      <TrendingDown fontSize="small" /> +5% vs last period
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" variant="body2">Loss Ratio</Typography>
                    <Typography variant="h4">{claimsReport?.lossRatio?.toFixed(1) || 0}%</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Target: &lt; 70%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>

        <TabPanel value={reportTab} index={1}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Financial Summary</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Metric</TableCell>
                    <TableCell align="right">Value</TableCell>
                    <TableCell align="right">Change</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Premiums Issued</TableCell>
                    <TableCell align="right">{formatCurrency(financialReport?.totalPremiums || 0)}</TableCell>
                    <TableCell align="right" style={{ color: 'green' }}>+8%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Premiums Received</TableCell>
                    <TableCell align="right">{formatCurrency(financialReport?.receivedPremiums || 0)}</TableCell>
                    <TableCell align="right" style={{ color: 'green' }}>+12%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Commissions Paid</TableCell>
                    <TableCell align="right">{formatCurrency(financialReport?.totalCommissions || 0)}</TableCell>
                    <TableCell align="right" style={{ color: 'red' }}>+3%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Claims Paid</TableCell>
                    <TableCell align="right">{formatCurrency(financialReport?.totalClaimsPaid || 0)}</TableCell>
                    <TableCell align="right" style={{ color: 'red' }}>+15%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Net Result</strong></TableCell>
                    <TableCell align="right"><strong>{formatCurrency(financialReport?.netResult || 0)}</strong></TableCell>
                    <TableCell align="right" style={{ color: 'green' }}><strong>+5%</strong></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </TabPanel>

        <TabPanel value={reportTab} index={2}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Policy Summary</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Count</TableCell>
                    <TableCell align="right">Total Premium</TableCell>
                    <TableCell align="right">Average Premium</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {policiesReport?.byType?.map((item: any) => (
                    <TableRow key={item.type}>
                      <TableCell>{item.type}</TableCell>
                      <TableCell align="right">{item.count}</TableCell>
                      <TableCell align="right">{formatCurrency(item.premium)}</TableCell>
                      <TableCell align="right">{formatCurrency(item.average)}</TableCell>
                    </TableRow>
                  )) || (
                    <TableRow>
                      <TableCell colSpan={4} align="center">No data available</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </TabPanel>

        <TabPanel value={reportTab} index={3}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Claims Summary</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Count</TableCell>
                    <TableCell align="right">Claimed Amount</TableCell>
                    <TableCell align="right">Paid Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {claimsReport?.byStatus?.map((item: any) => (
                    <TableRow key={item.status}>
                      <TableCell>{item.status}</TableCell>
                      <TableCell align="right">{item.count}</TableCell>
                      <TableCell align="right">{formatCurrency(item.claimed)}</TableCell>
                      <TableCell align="right">{formatCurrency(item.paid)}</TableCell>
                    </TableRow>
                  )) || (
                    <TableRow>
                      <TableCell colSpan={4} align="center">No data available</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>Reports</Typography>

      {/* Main Navigation Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Report sections"
        >
          <Tab icon={<BarChart />} label="Report Generator" id="main-tab-0" />
          <Tab icon={<LibraryBooks />} label="Report Library" id="main-tab-1" />
          <Tab icon={<Build />} label="Custom Builder" id="main-tab-2" />
          <Tab icon={<Schedule />} label="Scheduled Reports" id="main-tab-3" />
          <Tab icon={<DashboardIcon />} label="Dashboard Widgets" id="main-tab-4" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && renderReportGenerator()}
      {activeTab === 1 && <ReportLibrary />}
      {activeTab === 2 && <ReportBuilder />}
      {activeTab === 3 && <ScheduledReports />}
      {activeTab === 4 && (
        <Box>
          <Typography variant="h5" gutterBottom>Dashboard Widgets</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Pin report summaries to your dashboard for quick access.
          </Typography>
          <Grid container spacing={3}>
            {[
              { title: 'Premium Revenue', value: formatCurrency(financialReport?.totalPremiums || 0), change: '+8%', positive: true },
              { title: 'Active Claims', value: String(claimsReport?.totalClaims || 0), change: '+5%', positive: false },
              { title: 'Loss Ratio', value: `${claimsReport?.lossRatio?.toFixed(1) || 0}%`, change: '-2%', positive: true },
              { title: 'Net Result', value: formatCurrency(financialReport?.netResult || 0), change: '+5%', positive: true },
            ].map((widget) => (
              <Grid item xs={12} sm={6} md={3} key={widget.title}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography color="text.secondary" variant="body2" gutterBottom>
                      {widget.title}
                    </Typography>
                    <Typography variant="h5" fontWeight="bold">
                      {widget.value}
                    </Typography>
                    <Typography
                      variant="caption"
                      color={widget.positive ? 'success.main' : 'error.main'}
                    >
                      {widget.positive ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />}
                      {' '}{widget.change} vs last period
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Alert severity="info" sx={{ mt: 3 }}>
            Generate a report first to populate widget data. Widgets will auto-update based on the latest report data.
          </Alert>
        </Box>
      )}
    </Box>
  );
};

export default Reports;
