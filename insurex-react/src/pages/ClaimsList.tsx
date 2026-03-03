// ─────────────────────────────────────────────────────────────────────────────
// src/pages/claims/ClaimsList.tsx
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from 'react';
import { Box, Button, Chip, Stack, Tab, Tabs, Typography, IconButton } from '@mui/material';
import { Add, Visibility } from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useClaims } from '../../hooks/useClaims';
import { ClaimStatus } from '../../types/claim';

const STATUS_COLOR: Record<ClaimStatus, any> = {
  Submitted:   'info',
  InReview:    'warning',
  Approved:    'success',
  Rejected:    'error',
  Paid:        'default',
  Cancelled:   'default',
};

const TABS: { label: string; value: ClaimStatus | 'All' }[] = [
  { label: 'All',        value: 'All' },
  { label: 'Submitted',  value: 'Submitted' },
  { label: 'In Review',  value: 'InReview' },
  { label: 'Approved',   value: 'Approved' },
  { label: 'Rejected',   value: 'Rejected' },
  { label: 'Paid',       value: 'Paid' },
];

export default function ClaimsList() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<ClaimStatus | 'All'>('All');
  const [page, setPage] = useState(0);
  const { claims, total, loading } = useClaims({
    status: tab === 'All' ? undefined : tab,
    page, pageSize: 25,
  });

  const cols: GridColDef[] = [
    { field: 'claimNumber', headerName: 'Claim #', width: 130,
      renderCell: (p: GridRenderCellParams) => (
        <Button size="small" onClick={() => navigate(`/claims/${p.row.id}`)}>{p.value}</Button>
      ),
    },
    { field: 'policyNumber',  headerName: 'Policy #',    width: 130 },
    { field: 'claimantName',  headerName: 'Claimant',    flex: 1, minWidth: 150 },
    { field: 'type',          headerName: 'Type',         width: 120 },
    { field: 'claimedAmount', headerName: 'Amount (€)',   width: 120,
      valueFormatter: ({ value }) =>
        value != null ? Number(value).toLocaleString('pt-PT', { minimumFractionDigits: 2 }) : '—',
    },
    { field: 'incidentDate', headerName: 'Incident',  width: 110,
      valueFormatter: ({ value }) => value ? new Date(value).toLocaleDateString('pt-PT') : '—',
    },
    { field: 'status', headerName: 'Status', width: 120,
      renderCell: (p: GridRenderCellParams<any, ClaimStatus>) => (
        <Chip label={p.value?.replace('InReview','In Review')} size="small"
          color={STATUS_COLOR[p.value!]} />
      ),
    },
    { field: 'view', headerName: '', width: 48, sortable: false,
      renderCell: (p: GridRenderCellParams) => (
        <IconButton size="small" onClick={() => navigate(`/claims/${p.row.id}`)}>
          <Visibility fontSize="small" />
        </IconButton>
      ),
    },
  ];

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight={600}>Claims</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/claims/new')}>
          Submit Claim
        </Button>
      </Stack>

      <Tabs value={tab} onChange={(_, v) => { setTab(v); setPage(0); }} sx={{ mb: 2 }}>
        {TABS.map(t => <Tab key={t.value} label={t.label} value={t.value} />)}
      </Tabs>

      <DataGrid
        rows={claims} columns={cols} rowCount={total} loading={loading}
        paginationMode="server"
        paginationModel={{ page, pageSize: 25 }}
        onPaginationModelChange={m => setPage(m.page)}
        pageSizeOptions={[25, 50]}
        disableRowSelectionOnClick autoHeight sx={{ border: 0 }}
      />
    </Box>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// src/pages/claims/ClaimDetails.tsx
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from 'react';
import {
  Box, Button, Card, CardContent, Chip, Divider,
  Grid, Stack, Step, StepLabel, Stepper, Tab, Tabs, Typography,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useClaims } from '../../hooks/useClaims';
import { useAuth } from '../../hooks/useAuth';
import PaymentModal from '../../components/claims/PaymentModal';
import ClaimNotesTimeline from '../../components/claims/ClaimNotesTimeline';
import DocumentUpload from '../../components/shared/DocumentUpload';

const WORKFLOW = ['Submitted', 'InReview', 'Approved', 'Paid'];

export default function ClaimDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { claim, loading, approveClaim, rejectClaim, refetch } = useClaims({ claimId: id });
  const { user } = useAuth();
  const [tab, setTab] = useState(0);
  const [payOpen, setPayOpen] = useState(false);

  if (loading || !claim) return <Typography>Loading…</Typography>;

  const isAdjuster  = user?.roles?.includes('Adjuster') || user?.roles?.includes('Admin');
  const canApprove  = isAdjuster && claim.status === 'InReview';
  const canMarkPaid = isAdjuster && claim.status === 'Approved';
  const stepIdx     = WORKFLOW.indexOf(claim.status);

  return (
    <Box>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={600}>{claim.claimNumber}</Typography>
          <Typography variant="body2" color="text.secondary">{claim.claimantName}</Typography>
        </Box>
        <Chip label={claim.status.replace('InReview','In Review')} color={STATUS_COLOR[claim.status]} />
      </Stack>

      {/* Workflow stepper */}
      <Stepper activeStep={stepIdx} sx={{ mb: 3 }}>
        {WORKFLOW.map(s => (
          <Step key={s}><StepLabel>{s.replace('InReview','In Review')}</StepLabel></Step>
        ))}
      </Stepper>

      {/* Action buttons */}
      {(canApprove || canMarkPaid) && (
        <Stack direction="row" spacing={1} mb={3}>
          {canApprove && (
            <>
              <Button variant="contained" color="success"
                onClick={async () => { await approveClaim(id!); refetch(); }}>
                Approve
              </Button>
              <Button variant="outlined" color="error"
                onClick={async () => { await rejectClaim(id!); refetch(); }}>
                Reject
              </Button>
            </>
          )}
          {canMarkPaid && (
            <Button variant="contained" onClick={() => setPayOpen(true)}>
              Record Payment
            </Button>
          )}
        </Stack>
      )}

      {/* Tabs */}
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        {['Overview', 'Documents', 'Notes & Timeline'].map((l, i) => (
          <Tab key={i} label={l} value={i} />
        ))}
      </Tabs>

      {tab === 0 && (
        <Card variant="outlined">
          <CardContent>
            <Grid container spacing={2}>
              {[
                ['Policy #',      claim.policyNumber],
                ['Type',          claim.type],
                ['Incident Date', new Date(claim.incidentDate).toLocaleDateString('pt-PT')],
                ['Claimed (€)',   Number(claim.claimedAmount).toLocaleString('pt-PT', { minimumFractionDigits: 2 })],
                ['Approved (€)',  claim.approvedAmount
                  ? Number(claim.approvedAmount).toLocaleString('pt-PT', { minimumFractionDigits: 2 }) : '—'],
                ['Description',   claim.description],
              ].map(([k, v]) => (
                <Grid item xs={12} sm={6} key={k}>
                  <Typography variant="body2" color="text.secondary">{k}</Typography>
                  <Typography variant="body1">{v}</Typography>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {tab === 1 && (
        <DocumentUpload entityType="claims" entityId={id!} onUploaded={refetch} />
      )}

      {tab === 2 && (
        <ClaimNotesTimeline claimId={id!} />
      )}

      <PaymentModal
        open={payOpen}
        claimId={id!}
        approvedAmount={claim.approvedAmount}
        onClose={() => setPayOpen(false)}
        onSuccess={() => { setPayOpen(false); refetch(); }}
      />
    </Box>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// src/components/claims/PaymentModal.tsx
// ─────────────────────────────────────────────────────────────────────────────
import {
  Button, Dialog, DialogActions, DialogContent,
  DialogTitle, MenuItem, Stack, TextField,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useClaims } from '../../hooks/useClaims';

const schema = z.object({
  amount:    z.coerce.number().min(0.01, 'Required'),
  method:    z.string().min(1, 'Required'),
  reference: z.string().min(1, 'Required'),
  notes:     z.string().optional(),
});
type Form = z.infer<typeof schema>;

interface Props {
  open: boolean;
  claimId: string;
  approvedAmount?: number;
  onClose: () => void;
  onSuccess: () => void;
}

const METHODS = ['Bank Transfer', 'Cheque', 'Direct Deposit'];

export default function PaymentModal({ open, claimId, approvedAmount, onClose, onSuccess }: Props) {
  const { recordPayment } = useClaims({});
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { amount: approvedAmount ?? 0, method: '', reference: '', notes: '' },
  });

  const onSubmit = async (data: Form) => {
    await recordPayment(claimId, data);
    onSuccess();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Record Payment</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1} component="form" id="pay-form" onSubmit={handleSubmit(onSubmit)}>
          <Controller name="amount" control={control} render={({ field }) => (
            <TextField {...field} label="Amount (€)" type="number" fullWidth
              error={!!errors.amount} helperText={errors.amount?.message} />
          )} />
          <Controller name="method" control={control} render={({ field }) => (
            <TextField {...field} select label="Payment Method" fullWidth
              error={!!errors.method} helperText={errors.method?.message}>
              {METHODS.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
            </TextField>
          )} />
          <Controller name="reference" control={control} render={({ field }) => (
            <TextField {...field} label="Reference / Transaction #" fullWidth
              error={!!errors.reference} helperText={errors.reference?.message} />
          )} />
          <Controller name="notes" control={control} render={({ field }) => (
            <TextField {...field} label="Notes (optional)" multiline rows={2} fullWidth />
          )} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>Cancel</Button>
        <Button type="submit" form="pay-form" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? 'Processing…' : 'Record Payment'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}