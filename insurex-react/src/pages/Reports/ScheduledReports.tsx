import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  Schedule,
  Email,
  PlayArrow,
  Pause,
} from '@mui/icons-material';
import { useReports } from '../../hooks/useReports';
import { useNotification } from '../../hooks/useNotification';
import { formatDate } from '../../utils/formatters';

interface ScheduledReportItem {
  id: string;
  name: string;
  type: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  recipients: string[];
  nextRun: string;
  isActive: boolean;
  lastRun?: string;
  createdAt: string;
}

const reportTypeLabels: Record<string, string> = {
  financial: 'Financial Summary',
  policies: 'Policy Report',
  claims: 'Claims Report',
  assets: 'Assets Report',
  partners: 'Partner Report',
};

const frequencyLabels: Record<string, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
};

export const ScheduledReports: React.FC = () => {
  const { showSuccess, showError } = useNotification();
  const { scheduleReport, getScheduledReports, loading } = useReports();

  const [scheduledReports, setScheduledReports] = useState<ScheduledReportItem[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loadingReports, setLoadingReports] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: 'financial',
    frequency: 'weekly' as 'daily' | 'weekly' | 'monthly',
    recipients: '',
    time: '08:00',
    dayOfWeek: 1,
    dayOfMonth: 1,
  });

  useEffect(() => {
    loadScheduledReports();
  }, []);

  const loadScheduledReports = async () => {
    try {
      const reports = await getScheduledReports();
      setScheduledReports(reports as ScheduledReportItem[]);
    } catch {
      // Use empty list on error
      setScheduledReports([]);
    } finally {
      setLoadingReports(false);
    }
  };

  const handleOpenDialog = () => {
    setFormData({
      name: '',
      type: 'financial',
      frequency: 'weekly',
      recipients: '',
      time: '08:00',
      dayOfWeek: 1,
      dayOfMonth: 1,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.recipients.trim()) {
      showError('Please fill in all required fields');
      return;
    }

    const recipients = formData.recipients.split(',').map((r) => r.trim()).filter(Boolean);
    if (recipients.length === 0) {
      showError('Please add at least one recipient email');
      return;
    }

    try {
      await scheduleReport({
        type: formData.type,
        frequency: formData.frequency,
        recipients,
        time: formData.time,
        dayOfWeek: formData.frequency === 'weekly' ? formData.dayOfWeek : undefined,
        dayOfMonth: formData.frequency === 'monthly' ? formData.dayOfMonth : undefined,
      });

      // Add to local state
      const newReport: ScheduledReportItem = {
        id: Date.now().toString(),
        name: formData.name,
        type: formData.type,
        frequency: formData.frequency,
        recipients,
        nextRun: new Date(Date.now() + 86400000).toISOString(),
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      setScheduledReports((prev) => [...prev, newReport]);
      setDialogOpen(false);
      showSuccess('Report scheduled successfully!');
    } catch {
      showError('Failed to schedule report');
    }
  };

  const toggleActive = (id: string) => {
    setScheduledReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    );
    showSuccess('Schedule updated');
  };

  const handleDelete = (id: string) => {
    setScheduledReports((prev) => prev.filter((r) => r.id !== id));
    showSuccess('Scheduled report removed');
  };

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" gutterBottom>Scheduled Reports</Typography>
          <Typography variant="body2" color="text.secondary">
            Configure automated report generation and email delivery.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenDialog}
        >
          New Schedule
        </Button>
      </Box>

      {loadingReports ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : scheduledReports.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Schedule sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Scheduled Reports
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Set up automated reports to be generated and emailed on a schedule.
          </Typography>
          <Button variant="contained" startIcon={<Add />} onClick={handleOpenDialog}>
            Create First Schedule
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Report Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Frequency</TableCell>
                <TableCell>Recipients</TableCell>
                <TableCell>Next Run</TableCell>
                <TableCell>Active</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scheduledReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">{report.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={reportTypeLabels[report.type] || report.type} size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={<Schedule fontSize="small" />}
                      label={frequencyLabels[report.frequency]}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {report.recipients.slice(0, 2).map((email) => (
                        <Chip key={email} label={email} size="small" variant="outlined" />
                      ))}
                      {report.recipients.length > 2 && (
                        <Chip label={`+${report.recipients.length - 2}`} size="small" />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(report.nextRun)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={report.isActive}
                      onChange={() => toggleActive(report.id)}
                      size="small"
                      aria-label={`Toggle ${report.name} schedule`}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Delete schedule">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(report.id)}
                        aria-label={`Delete ${report.name} schedule`}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create Schedule Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Schedule New Report</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Schedule Name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                aria-label="Schedule name"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Report Type</InputLabel>
                <Select
                  value={formData.type}
                  label="Report Type"
                  onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
                >
                  {Object.entries(reportTypeLabels).map(([value, label]) => (
                    <MenuItem key={value} value={value}>{label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Frequency</InputLabel>
                <Select
                  value={formData.frequency}
                  label="Frequency"
                  onChange={(e) => setFormData((prev) => ({ ...prev, frequency: e.target.value as any }))}
                >
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {formData.frequency === 'weekly' && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Day of Week</InputLabel>
                  <Select
                    value={formData.dayOfWeek}
                    label="Day of Week"
                    onChange={(e) => setFormData((prev) => ({ ...prev, dayOfWeek: Number(e.target.value) }))}
                  >
                    {daysOfWeek.map((day, index) => (
                      <MenuItem key={day} value={index}>{day}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            {formData.frequency === 'monthly' && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Day of Month"
                  value={formData.dayOfMonth}
                  onChange={(e) => setFormData((prev) => ({ ...prev, dayOfMonth: Number(e.target.value) }))}
                  inputProps={{ min: 1, max: 28 }}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="time"
                label="Time"
                value={formData.time}
                onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Recipients (comma-separated emails)"
                value={formData.recipients}
                onChange={(e) => setFormData((prev) => ({ ...prev, recipients: e.target.value }))}
                placeholder="user@example.com, admin@example.com"
                helperText="Enter email addresses separated by commas"
                aria-label="Recipient email addresses"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Schedule />}
          >
            Create Schedule
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ScheduledReports;
