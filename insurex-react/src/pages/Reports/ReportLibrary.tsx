import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import {
  Search,
  PictureAsPdf,
  TableChart,
  Assessment,
  TrendingUp,
  AttachMoney,
  Assignment,
  Warning,
  Business,
  Inventory,
} from '@mui/icons-material';
import { useReports } from '../../hooks/useReports';
import { useNotification } from '../../hooks/useNotification';

interface PredefinedReport {
  id: string;
  name: string;
  description: string;
  category: string;
  type: string;
  icon: React.ReactElement;
  tags: string[];
}

const predefinedReports: PredefinedReport[] = [
  {
    id: 'financial-summary',
    name: 'Financial Summary',
    description: 'Complete financial overview including premiums, commissions, and claims paid.',
    category: 'Financial',
    type: 'financial',
    icon: <AttachMoney />,
    tags: ['finance', 'premiums', 'revenue'],
  },
  {
    id: 'policy-overview',
    name: 'Policy Overview',
    description: 'Summary of all policies by type, status, and premium distribution.',
    category: 'Policies',
    type: 'policies',
    icon: <Assignment />,
    tags: ['policies', 'coverage', 'status'],
  },
  {
    id: 'claims-analysis',
    name: 'Claims Analysis',
    description: 'Detailed claims analysis by status, type, and loss ratio metrics.',
    category: 'Claims',
    type: 'claims',
    icon: <Warning />,
    tags: ['claims', 'loss ratio', 'analysis'],
  },
  {
    id: 'expiring-policies',
    name: 'Expiring Policies',
    description: 'List of policies expiring within the selected period for renewal follow-up.',
    category: 'Policies',
    type: 'policies',
    icon: <TrendingUp />,
    tags: ['expiring', 'renewal', 'follow-up'],
  },
  {
    id: 'uninsured-assets',
    name: 'Uninsured Assets Report',
    description: 'Assets without active insurance coverage requiring attention.',
    category: 'Assets',
    type: 'assets',
    icon: <Inventory />,
    tags: ['assets', 'uninsured', 'risk'],
  },
  {
    id: 'partner-performance',
    name: 'Partner Performance',
    description: 'Broker and partner performance metrics including policies sold and commissions.',
    category: 'Partners',
    type: 'partners',
    icon: <Business />,
    tags: ['partners', 'brokers', 'performance'],
  },
  {
    id: 'premium-collection',
    name: 'Premium Collection',
    description: 'Premium collection status, overdue payments, and collection rate analysis.',
    category: 'Financial',
    type: 'financial',
    icon: <AttachMoney />,
    tags: ['premiums', 'collection', 'overdue'],
  },
  {
    id: 'monthly-transactions',
    name: 'Monthly Transactions',
    description: 'All transactions for the selected month including premiums, claims, and commissions.',
    category: 'Financial',
    type: 'financial',
    icon: <Assessment />,
    tags: ['transactions', 'monthly', 'summary'],
  },
  {
    id: 'loss-ratio',
    name: 'Loss Ratio Report',
    description: 'Loss ratio analysis by policy type and time period for underwriting decisions.',
    category: 'Claims',
    type: 'claims',
    icon: <TrendingUp />,
    tags: ['loss ratio', 'underwriting', 'risk'],
  },
];

const categories = ['All', 'Financial', 'Policies', 'Claims', 'Assets', 'Partners'];

export const ReportLibrary: React.FC = () => {
  const { showSuccess, showError } = useNotification();
  const { exportReport, loading } = useReports();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [exportingId, setExportingId] = useState<string | null>(null);

  const filteredReports = predefinedReports.filter((report) => {
    const matchesSearch =
      !searchQuery ||
      report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || report.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleExport = async (report: PredefinedReport, format: 'pdf' | 'excel') => {
    setExportingId(report.id);
    try {
      await exportReport({ type: report.type, format });
      showSuccess(`${report.name} exported as ${format.toUpperCase()}`);
    } catch {
      showError(`Failed to export ${report.name}`);
    } finally {
      setExportingId(null);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Report Library</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Browse and generate predefined reports. Click export to download in your preferred format.
      </Typography>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search reports..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          sx={{ minWidth: 250 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
          }}
          aria-label="Search reports"
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="report-category-filter">Category</InputLabel>
          <Select
            labelId="report-category-filter"
            value={selectedCategory}
            label="Category"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Report Cards */}
      <Grid container spacing={3}>
        {filteredReports.map((report) => (
          <Grid item xs={12} sm={6} md={4} key={report.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'box-shadow 0.2s',
                '&:hover': { boxShadow: 4 },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Box sx={{ color: 'primary.main' }}>{report.icon}</Box>
                  <Typography variant="h6" component="h3">{report.name}</Typography>
                </Box>
                <Chip label={report.category} size="small" variant="outlined" sx={{ mb: 1.5 }} />
                <Typography variant="body2" color="text.secondary">
                  {report.description}
                </Typography>
                <Box sx={{ mt: 1.5, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {report.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                  ))}
                </Box>
              </CardContent>
              <CardActions sx={{ px: 2, pb: 2 }}>
                <Button
                  size="small"
                  startIcon={exportingId === report.id ? <CircularProgress size={14} /> : <PictureAsPdf />}
                  onClick={() => handleExport(report, 'pdf')}
                  disabled={exportingId === report.id}
                >
                  PDF
                </Button>
                <Button
                  size="small"
                  startIcon={exportingId === report.id ? <CircularProgress size={14} /> : <TableChart />}
                  onClick={() => handleExport(report, 'excel')}
                  disabled={exportingId === report.id}
                >
                  Excel
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredReports.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Assessment sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No reports found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search or category filter.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ReportLibrary;
