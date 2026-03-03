// ─────────────────────────────────────────────────────────────────────────────
// src/components/shared/DocumentUpload.tsx
// ─────────────────────────────────────────────────────────────────────────────
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box, Button, IconButton, LinearProgress, List, ListItem,
  ListItemText, Stack, Typography, Paper,
} from '@mui/material';
import { CloudUpload, Delete, InsertDriveFile } from '@mui/icons-material';
import apiClient from '../../services/apiClient';

interface UploadFile { name: string; size: number; progress: number; error?: string; done?: boolean }

interface Props {
  entityType: 'claims' | 'policies' | 'assets';
  entityId:   string;
  onUploaded?: () => void;
  accept?:     Record<string, string[]>;
}

export default function DocumentUpload({ entityType, entityId, onUploaded,
  accept = { 'application/pdf': [], 'image/*': [] } }: Props) {
  const [files, setFiles] = useState<UploadFile[]>([]);

  const uploadFile = async (file: File, idx: number) => {
    const form = new FormData();
    form.append('file', file);
    try {
      await apiClient.post(`/api/${entityType}/${entityId}/documents`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: e => {
          const pct = Math.round((e.loaded * 100) / (e.total ?? 1));
          setFiles(prev => prev.map((f, i) => i === idx ? { ...f, progress: pct } : f));
        },
      });
      setFiles(prev => prev.map((f, i) => i === idx ? { ...f, done: true, progress: 100 } : f));
      onUploaded?.();
    } catch {
      setFiles(prev => prev.map((f, i) =>
        i === idx ? { ...f, error: 'Upload failed. Please retry.' } : f));
    }
  };

  const onDrop = useCallback((accepted: File[]) => {
    const startIdx = files.length;
    const newFiles = accepted.map(f => ({ name: f.name, size: f.size, progress: 0 }));
    setFiles(prev => [...prev, ...newFiles]);
    accepted.forEach((f, i) => uploadFile(f, startIdx + i));
  }, [files.length]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept });

  const fmt = (b: number) => b > 1e6 ? `${(b/1e6).toFixed(1)} MB` : `${(b/1e3).toFixed(0)} KB`;

  return (
    <Box>
      <Paper
        variant="outlined"
        {...getRootProps()}
        sx={{
          p: 4, textAlign: 'center', cursor: 'pointer', borderStyle: 'dashed',
          bgcolor: isDragActive ? 'action.hover' : 'transparent',
          '&:hover': { bgcolor: 'action.hover' },
        }}
      >
        <input {...getInputProps()} />
        <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
        <Typography variant="body1">
          {isDragActive ? 'Drop files here…' : 'Drag & drop files, or click to select'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          PDF, JPG, PNG — max 20 MB per file
        </Typography>
      </Paper>

      {files.length > 0 && (
        <List dense sx={{ mt: 1 }}>
          {files.map((f, i) => (
            <ListItem key={i} disablePadding sx={{ mb: 0.5 }}>
              <InsertDriveFile fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
              <ListItemText
                primary={<Typography variant="body2">{f.name} — {fmt(f.size)}</Typography>}
                secondary={
                  f.error ? <Typography variant="caption" color="error">{f.error}</Typography>
                  : f.done ? <Typography variant="caption" color="success.main">Uploaded ✓</Typography>
                  : <LinearProgress variant="determinate" value={f.progress} sx={{ mt: 0.5 }} />
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// src/components/shared/ConfirmDialog.tsx
// ─────────────────────────────────────────────────────────────────────────────
import {
  Button, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle,
} from '@mui/material';

interface Props {
  open:          boolean;
  title:         string;
  message:       string;
  confirmLabel?: string;
  confirmColor?: 'primary' | 'error' | 'warning' | 'success';
  onConfirm:     () => void | Promise<void>;
  onClose:       () => void;
}

export function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm',
  confirmColor = 'primary', onConfirm, onClose }: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color={confirmColor} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default ConfirmDialog;


// ─────────────────────────────────────────────────────────────────────────────
// src/components/dashboard/KpiCharts.tsx
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useState } from 'react';
import { Box, Card, CardContent, CardHeader, Grid, Typography } from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import apiClient from '../../services/apiClient';

const PIE_COLORS = ['#1976d2','#2e7d32','#d32f2f','#ed6c02','#757575'];

export default function KpiCharts() {
  const [policyStats, setPolicyStats] = useState<any[]>([]);
  const [claimTrend,  setClaimTrend]  = useState<any[]>([]);

  useEffect(() => {
    apiClient.get('/api/policies/statistics').then(r => {
      const d = r.data;
      setPolicyStats([
        { name: 'Active',    value: d.active    ?? 0 },
        { name: 'Draft',     value: d.draft     ?? 0 },
        { name: 'Expired',   value: d.expired   ?? 0 },
        { name: 'Cancelled', value: d.cancelled ?? 0 },
        { name: 'Pending',   value: d.pending   ?? 0 },
      ]);
    });
    apiClient.get('/api/claims/statistics?period=6m').then(r => setClaimTrend(r.data.monthly ?? []));
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={5}>
        <Card variant="outlined">
          <CardHeader title={<Typography variant="subtitle1" fontWeight={600}>Policies by Status</Typography>} />
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={policyStats} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                  {policyStats.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={7}>
        <Card variant="outlined">
          <CardHeader title={<Typography variant="subtitle1" fontWeight={600}>Claims — Last 6 Months</Typography>} />
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={claimTrend} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="submitted" name="Submitted" fill="#1976d2" />
                <Bar dataKey="approved"  name="Approved"  fill="#2e7d32" />
                <Bar dataKey="paid"      name="Paid"      fill="#9c27b0" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}