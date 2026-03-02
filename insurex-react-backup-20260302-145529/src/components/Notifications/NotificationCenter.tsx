import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Send, Email } from '@mui/icons-material';
import { emailService } from '../../services/email.service';

export const NotificationCenter: React.FC = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [sendDialog, setSendDialog] = useState(false);
  const [formData, setFormData] = useState({
    to: '',
    subject: '',
    body: '',
    template: '',
  });

  useEffect(() => {
    loadTemplates();
    loadLogs();
  }, []);

  const loadTemplates = async () => {
    try {
      const response = await emailService.getTemplates();
      setTemplates(response.data || []);
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  const loadLogs = async () => {
    try {
      const response = await emailService.getEmailLogs();
      setLogs(response.data?.items || []);
    } catch (error) {
      console.error('Failed to load logs:', error);
    }
  };

  const handleSendEmail = async () => {
    try {
      if (formData.template) {
        await emailService.sendTemplatedEmail({
          to: formData.to,
          template: formData.template,
          data: {},
        });
      } else {
        await emailService.sendEmail({
          to: formData.to,
          subject: formData.subject,
          body: formData.body,
        });
      }
      setSendDialog(false);
      loadLogs();
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Sent': return 'success';
      case 'Failed': return 'error';
      case 'Pending': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Notification Center</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<Send />}
              onClick={() => setSendDialog(true)}
            >
              Send Email
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Recent Email Logs</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>To</TableCell>
                    <TableCell>Subject</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logs.slice(0, 5).map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{log.to}</TableCell>
                      <TableCell>{log.subject}</TableCell>
                      <TableCell>
                        <Chip label={log.status} color={getStatusColor(log.status) as any} size="small" />
                      </TableCell>
                      <TableCell>{new Date(log.sentAt).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={sendDialog} onClose={() => setSendDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Send Email</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="To"
                  value={formData.to}
                  onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Template</InputLabel>
                  <Select
                    value={formData.template}
                    label="Template"
                    onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                  >
                    <MenuItem value="">No Template</MenuItem>
                    {templates.map((template) => (
                      <MenuItem key={template.id} value={template.name}>
                        {template.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {!formData.template && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={6}
                      label="Body"
                      value={formData.body}
                      onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSendDialog(false)}>Cancel</Button>
          <Button onClick={handleSendEmail} variant="contained">Send</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
