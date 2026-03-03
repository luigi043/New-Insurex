// src/pages/policies/PolicyList.tsx
import { useState, useCallback } from 'react';
import {
  Box, Button, Chip, IconButton, InputAdornment, Stack,
  TextField, Tooltip, Typography, Menu, MenuItem,
} from '@mui/material';
import {
  Add, Search, MoreVert, Visibility, Edit,
  CheckCircle, Cancel, Autorenew, FilterList,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { usePolicies } from '../../hooks/usePolicies';
import { PolicyStatus } from '../../types/policy';
import PolicyRenewalModal from '../../components/policies/PolicyRenewalModal';
import ConfirmDialog from '../../components/shared/ConfirmDialog';

const STATUS_COLOR: Record<PolicyStatus, 'default' | 'warning' | 'success' | 'error' | 'info'> = {
  Draft:     'default',
  Active:    'success',
  Expired:   'warning',
  Cancelled: 'error',
  Pending:   'info',
};

const STATUS_OPTIONS: PolicyStatus[] = ['Draft', 'Active', 'Expired', 'Cancelled', 'Pending'];

export default function PolicyList() {
  const navigate = useNavigate();
  const [search, setSearch]           = useState('');
  const [statuses, setStatuses]       = useState<PolicyStatus[]>([]);
  const [page, setPage]               = useState(0);
  const [pageSize, setPageSize]       = useState(25);
  const [sortModel, setSortModel]     = useState<GridSortModel>([]);
  const [anchorEl, setAnchorEl]       = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId]   = useState<string | null>(null);
  const [renewTarget, setRenewTarget] = useState<string | null>(null);
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);

  const { policies, total, loading, activatePolicy, cancelPolicy, refetch } = usePolicies({
    search,
    statuses,
    page,
    pageSize,
    sortField:  sortModel[0]?.field,
    sortOrder:  sortModel[0]?.sort ?? undefined,
  });

  const openMenu = (e: React.MouseEvent<HTMLElement>, id: string) => {
    setAnchorEl(e.currentTarget);
    setSelectedId(id);
  };

  const closeMenu = () => { setAnchorEl(null); setSelectedId(null); };

  const toggleStatus = (s: PolicyStatus) =>
    setStatuses(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const handleActivate = useCallback(async (id: string) => {
    await activatePolicy(id);
    refetch();
    closeMenu();
  }, [activatePolicy, refetch]);

  const handleCancelConfirmed = useCallback(async () => {
    if (!cancelTarget) return;
    await cancelPolicy(cancelTarget);
    setCancelTarget(null);
    refetch();
  }, [cancelPolicy, cancelTarget, refetch]);

  const cols: GridColDef[] = [
    { field: 'policyNumber', headerName: 'Policy #', width: 140,
      renderCell: (p: GridRenderCellParams) => (
        <Button size="small" onClick={() => navigate(`/policies/${p.row.id}`)}>
          {p.value}
        </Button>
      ),
    },
    { field: 'insuredName',  headerName: 'Insured',      flex: 1, minWidth: 160 },
    { field: 'type',         headerName: 'Type',          width: 130 },
    { field: 'premium',      headerName: 'Premium',       width: 120,
      valueFormatter: ({ value }) =>
        value != null ? `€ ${Number(value).toLocaleString('pt-PT', { minimumFractionDigits: 2 })}` : '—',
    },
    { field: 'startDate', headerName: 'Start',  width: 110,
      valueFormatter: ({ value }) => value ? new Date(value).toLocaleDateString('pt-PT') : '—',
    },
    { field: 'endDate',   headerName: 'Expiry', width: 110,
      valueFormatter: ({ value }) => value ? new Date(value).toLocaleDateString('pt-PT') : '—',
    },
    { field: 'status', headerName: 'Status', width: 120,
      renderCell: (p: GridRenderCellParams<any, PolicyStatus>) => (
        <Chip label={p.value} size="small" color={STATUS_COLOR[p.value!]} />
      ),
    },
    { field: 'actions', headerName: '', width: 56, sortable: false, disableColumnMenu: true,
      renderCell: (p: GridRenderCellParams) => (
        <IconButton size="small" onClick={e => openMenu(e, p.row.id)}>
          <MoreVert fontSize="small" />
        </IconButton>
      ),
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight={600}>Policies</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/policies/new')}>
          New Policy
        </Button>
      </Stack>

      {/* Filters */}
      <Stack direction="row" spacing={1} flexWrap="wrap" mb={2} alignItems="center">
        <TextField
          size="small" placeholder="Search policies…" value={search}
          onChange={e => { setSearch(e.target.value); setPage(0); }}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }}
          sx={{ width: 260 }}
        />
        <FilterList fontSize="small" color="action" />
        {STATUS_OPTIONS.map(s => (
          <Chip
            key={s} label={s} size="small" clickable
            color={statuses.includes(s) ? STATUS_COLOR[s] : 'default'}
            variant={statuses.includes(s) ? 'filled' : 'outlined'}
            onClick={() => { toggleStatus(s); setPage(0); }}
          />
        ))}
        {statuses.length > 0 && (
          <Button size="small" onClick={() => setStatuses([])}>Clear</Button>
        )}
      </Stack>

      {/* Grid */}
      <DataGrid
        rows={policies}
        columns={cols}
        rowCount={total}
        loading={loading}
        paginationMode="server"
        sortingMode="server"
        paginationModel={{ page, pageSize }}
        onPaginationModelChange={m => { setPage(m.page); setPageSize(m.pageSize); }}
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        pageSizeOptions={[10, 25, 50]}
        disableRowSelectionOnClick
        autoHeight
        sx={{ border: 0 }}
      />

      {/* Row action menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
        <MenuItem onClick={() => { navigate(`/policies/${selectedId}`); closeMenu(); }}>
          <Visibility fontSize="small" sx={{ mr: 1 }} /> View
        </MenuItem>
        <MenuItem onClick={() => { navigate(`/policies/${selectedId}/edit`); closeMenu(); }}>
          <Edit fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={() => handleActivate(selectedId!)}>
          <CheckCircle fontSize="small" sx={{ mr: 1 }} /> Activate
        </MenuItem>
        <MenuItem onClick={() => { setRenewTarget(selectedId); closeMenu(); }}>
          <Autorenew fontSize="small" sx={{ mr: 1 }} /> Renew
        </MenuItem>
        <MenuItem onClick={() => { setCancelTarget(selectedId); closeMenu(); }} sx={{ color: 'error.main' }}>
          <Cancel fontSize="small" sx={{ mr: 1 }} /> Cancel
        </MenuItem>
      </Menu>

      {/* Renewal modal */}
      {renewTarget && (
        <PolicyRenewalModal
          policyId={renewTarget}
          open
          onClose={() => setRenewTarget(null)}
          onSuccess={() => { setRenewTarget(null); refetch(); }}
        />
      )}

      {/* Cancel confirmation */}
      <ConfirmDialog
        open={Boolean(cancelTarget)}
        title="Cancel Policy"
        message="Are you sure you want to cancel this policy? This action cannot be undone."
        confirmLabel="Yes, Cancel"
        confirmColor="error"
        onConfirm={handleCancelConfirmed}
        onClose={() => setCancelTarget(null)}
      />
    </Box>
  );
}