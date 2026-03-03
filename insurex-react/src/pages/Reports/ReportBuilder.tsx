import React, { useState } from 'react';
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
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import {
  Add,
  Delete,
  DragIndicator,
  ArrowUpward,
  ArrowDownward,
  Save,
  PlayArrow,
  PictureAsPdf,
  TableChart,
} from '@mui/icons-material';
import { useReports } from '../../hooks/useReports';
import { useNotification } from '../../hooks/useNotification';

interface ReportColumn {
  id: string;
  field: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'currency';
  visible: boolean;
  sortOrder?: 'asc' | 'desc' | null;
}

interface ReportFilter {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between' | 'in';
  value: string;
}

const availableDataSources = [
  { value: 'policies', label: 'Policies' },
  { value: 'claims', label: 'Claims' },
  { value: 'assets', label: 'Assets' },
  { value: 'billing', label: 'Billing' },
  { value: 'partners', label: 'Partners' },
];

const columnsBySource: Record<string, ReportColumn[]> = {
  policies: [
    { id: '1', field: 'policyNumber', label: 'Policy Number', type: 'text', visible: true },
    { id: '2', field: 'holderName', label: 'Holder Name', type: 'text', visible: true },
    { id: '3', field: 'type', label: 'Type', type: 'text', visible: true },
    { id: '4', field: 'premium', label: 'Premium', type: 'currency', visible: true },
    { id: '5', field: 'startDate', label: 'Start Date', type: 'date', visible: true },
    { id: '6', field: 'endDate', label: 'End Date', type: 'date', visible: true },
    { id: '7', field: 'status', label: 'Status', type: 'text', visible: true },
    { id: '8', field: 'coverageAmount', label: 'Coverage Amount', type: 'currency', visible: false },
  ],
  claims: [
    { id: '1', field: 'claimNumber', label: 'Claim Number', type: 'text', visible: true },
    { id: '2', field: 'claimantName', label: 'Claimant', type: 'text', visible: true },
    { id: '3', field: 'type', label: 'Type', type: 'text', visible: true },
    { id: '4', field: 'claimedAmount', label: 'Claimed Amount', type: 'currency', visible: true },
    { id: '5', field: 'approvedAmount', label: 'Approved Amount', type: 'currency', visible: true },
    { id: '6', field: 'incidentDate', label: 'Incident Date', type: 'date', visible: true },
    { id: '7', field: 'status', label: 'Status', type: 'text', visible: true },
  ],
  assets: [
    { id: '1', field: 'name', label: 'Asset Name', type: 'text', visible: true },
    { id: '2', field: 'type', label: 'Type', type: 'text', visible: true },
    { id: '3', field: 'value', label: 'Value', type: 'currency', visible: true },
    { id: '4', field: 'owner', label: 'Owner', type: 'text', visible: true },
    { id: '5', field: 'status', label: 'Status', type: 'text', visible: true },
  ],
  billing: [
    { id: '1', field: 'invoiceNumber', label: 'Invoice Number', type: 'text', visible: true },
    { id: '2', field: 'clientName', label: 'Client', type: 'text', visible: true },
    { id: '3', field: 'amount', label: 'Amount', type: 'currency', visible: true },
    { id: '4', field: 'dueDate', label: 'Due Date', type: 'date', visible: true },
    { id: '5', field: 'status', label: 'Status', type: 'text', visible: true },
  ],
  partners: [
    { id: '1', field: 'name', label: 'Partner Name', type: 'text', visible: true },
    { id: '2', field: 'type', label: 'Type', type: 'text', visible: true },
    { id: '3', field: 'commission', label: 'Commission Rate', type: 'number', visible: true },
    { id: '4', field: 'totalPolicies', label: 'Total Policies', type: 'number', visible: true },
    { id: '5', field: 'status', label: 'Status', type: 'text', visible: true },
  ],
};

export const ReportBuilder: React.FC = () => {
  const { showSuccess, showError } = useNotification();
  const { exportReport, loading } = useReports();

  const [activeStep, setActiveStep] = useState(0);
  const [reportName, setReportName] = useState('');
  const [dataSource, setDataSource] = useState('policies');
  const [columns, setColumns] = useState<ReportColumn[]>(columnsBySource.policies);
  const [filters, setFilters] = useState<ReportFilter[]>([]);
  const [groupBy, setGroupBy] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleDataSourceChange = (source: string) => {
    setDataSource(source);
    setColumns(columnsBySource[source] || []);
    setFilters([]);
    setGroupBy('');
    setSortBy('');
  };

  const toggleColumnVisibility = (columnId: string) => {
    setColumns((prev) =>
      prev.map((col) => (col.id === columnId ? { ...col, visible: !col.visible } : col))
    );
  };

  const moveColumn = (index: number, direction: 'up' | 'down') => {
    const newColumns = [...columns];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newColumns.length) return;
    [newColumns[index], newColumns[targetIndex]] = [newColumns[targetIndex], newColumns[index]];
    setColumns(newColumns);
  };

  const addFilter = () => {
    const visibleColumns = columns.filter((c) => c.visible);
    if (visibleColumns.length === 0) return;
    setFilters((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        field: visibleColumns[0].field,
        operator: 'equals',
        value: '',
      },
    ]);
  };

  const updateFilter = (id: string, updates: Partial<ReportFilter>) => {
    setFilters((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const removeFilter = (id: string) => {
    setFilters((prev) => prev.filter((f) => f.id !== id));
  };

  const handleExport = async (format: 'pdf' | 'excel') => {
    try {
      await exportReport({ type: dataSource, format });
      showSuccess(`Report exported as ${format.toUpperCase()}`);
    } catch {
      showError('Failed to export report');
    }
  };

  const handleSaveReport = () => {
    if (!reportName.trim()) {
      showError('Please enter a report name');
      return;
    }
    // Save report configuration
    const config = {
      name: reportName,
      dataSource,
      columns: columns.filter((c) => c.visible),
      filters,
      groupBy,
      sortBy,
      sortOrder,
    };
    localStorage.setItem(`report_${Date.now()}`, JSON.stringify(config));
    showSuccess('Report configuration saved!');
  };

  const steps = [
    {
      label: 'Data Source & Name',
      content: (
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Report Name"
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
            sx={{ mb: 2 }}
            aria-label="Report name"
          />
          <FormControl fullWidth>
            <InputLabel id="data-source-label">Data Source</InputLabel>
            <Select
              labelId="data-source-label"
              value={dataSource}
              label="Data Source"
              onChange={(e) => handleDataSourceChange(e.target.value)}
            >
              {availableDataSources.map((ds) => (
                <MenuItem key={ds.value} value={ds.value}>{ds.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      ),
    },
    {
      label: 'Select Columns',
      content: (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Click columns to toggle visibility. Use arrows to reorder.
          </Typography>
          <List dense>
            {columns.map((col, index) => (
              <ListItem
                key={col.id}
                sx={{
                  bgcolor: col.visible ? 'action.selected' : 'transparent',
                  borderRadius: 1,
                  mb: 0.5,
                }}
              >
                <DragIndicator fontSize="small" sx={{ mr: 1, color: 'text.disabled' }} />
                <ListItemText
                  primary={col.label}
                  secondary={col.type}
                  onClick={() => toggleColumnVisibility(col.id)}
                  sx={{ cursor: 'pointer' }}
                />
                <ListItemSecondaryAction>
                  <Chip
                    label={col.visible ? 'Visible' : 'Hidden'}
                    size="small"
                    color={col.visible ? 'primary' : 'default'}
                    variant="outlined"
                    onClick={() => toggleColumnVisibility(col.id)}
                    sx={{ mr: 1 }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => moveColumn(index, 'up')}
                    disabled={index === 0}
                    aria-label={`Move ${col.label} up`}
                  >
                    <ArrowUpward fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => moveColumn(index, 'down')}
                    disabled={index === columns.length - 1}
                    aria-label={`Move ${col.label} down`}
                  >
                    <ArrowDownward fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
      ),
    },
    {
      label: 'Filters & Sorting',
      content: (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>Filters</Typography>
          {filters.map((filter) => (
            <Box key={filter.id} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <Select
                  value={filter.field}
                  onChange={(e) => updateFilter(filter.id, { field: e.target.value })}
                >
                  {columns.filter((c) => c.visible).map((col) => (
                    <MenuItem key={col.field} value={col.field}>{col.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select
                  value={filter.operator}
                  onChange={(e) => updateFilter(filter.id, { operator: e.target.value as ReportFilter['operator'] })}
                >
                  <MenuItem value="equals">Equals</MenuItem>
                  <MenuItem value="contains">Contains</MenuItem>
                  <MenuItem value="greater_than">Greater Than</MenuItem>
                  <MenuItem value="less_than">Less Than</MenuItem>
                </Select>
              </FormControl>
              <TextField
                size="small"
                placeholder="Value"
                value={filter.value}
                onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                sx={{ flexGrow: 1 }}
              />
              <IconButton size="small" onClick={() => removeFilter(filter.id)} aria-label="Remove filter">
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          ))}
          <Button size="small" startIcon={<Add />} onClick={addFilter} sx={{ mb: 3 }}>
            Add Filter
          </Button>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" gutterBottom>Sorting</Typography>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <FormControl fullWidth size="small">
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="">None</MenuItem>
                  {columns.filter((c) => c.visible).map((col) => (
                    <MenuItem key={col.field} value={col.field}>{col.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Order</InputLabel>
                <Select
                  value={sortOrder}
                  label="Order"
                  onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                >
                  <MenuItem value="asc">Ascending</MenuItem>
                  <MenuItem value="desc">Descending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" gutterBottom>Group By</Typography>
          <FormControl fullWidth size="small">
            <InputLabel>Group By</InputLabel>
            <Select
              value={groupBy}
              label="Group By"
              onChange={(e) => setGroupBy(e.target.value)}
            >
              <MenuItem value="">None</MenuItem>
              {columns.filter((c) => c.visible && c.type === 'text').map((col) => (
                <MenuItem key={col.field} value={col.field}>{col.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      ),
    },
    {
      label: 'Preview & Export',
      content: (
        <Box sx={{ mt: 2 }}>
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>Report Configuration Summary</Typography>
              <Typography variant="body2"><strong>Name:</strong> {reportName || 'Untitled Report'}</Typography>
              <Typography variant="body2"><strong>Data Source:</strong> {dataSource}</Typography>
              <Typography variant="body2">
                <strong>Columns:</strong> {columns.filter((c) => c.visible).map((c) => c.label).join(', ')}
              </Typography>
              <Typography variant="body2"><strong>Filters:</strong> {filters.length || 'None'}</Typography>
              <Typography variant="body2"><strong>Sort:</strong> {sortBy || 'None'} {sortBy ? `(${sortOrder})` : ''}</Typography>
              <Typography variant="body2"><strong>Group By:</strong> {groupBy || 'None'}</Typography>
            </CardContent>
          </Card>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <PlayArrow />}
              onClick={() => handleExport('excel')}
              disabled={loading}
            >
              Generate Report
            </Button>
            <Button
              variant="outlined"
              startIcon={<PictureAsPdf />}
              onClick={() => handleExport('pdf')}
              disabled={loading}
            >
              Export PDF
            </Button>
            <Button
              variant="outlined"
              startIcon={<TableChart />}
              onClick={() => handleExport('excel')}
              disabled={loading}
            >
              Export Excel
            </Button>
            <Button
              variant="outlined"
              startIcon={<Save />}
              onClick={handleSaveReport}
            >
              Save Configuration
            </Button>
          </Box>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Custom Report Builder</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Build custom reports by selecting data sources, columns, filters, and export options.
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                onClick={() => setActiveStep(index)}
                sx={{ cursor: 'pointer' }}
              >
                {step.label}
              </StepLabel>
              <StepContent>
                {step.content}
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={() => setActiveStep(index + 1)}
                    disabled={index === steps.length - 1}
                    sx={{ mr: 1 }}
                  >
                    Continue
                  </Button>
                  {index > 0 && (
                    <Button onClick={() => setActiveStep(index - 1)}>
                      Back
                    </Button>
                  )}
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Paper>
    </Box>
  );
};

export default ReportBuilder;
