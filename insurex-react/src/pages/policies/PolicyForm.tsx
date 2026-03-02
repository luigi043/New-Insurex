import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  CircularProgress,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { policyService } from '../../services/policy.service';
import { PolicyType, PolicyStatus } from '../../types/policy.types';
import { useAuth } from '../../hooks/useAuth';

const policySchema = z.object({
  policyNumber: z.string().min(3, 'Policy number is required'),
  name: z.string().min(3, 'Policy name is required'),
  description: z.string().optional(),
  type: z.nativeEnum(PolicyType),
  coverageAmount: z.number().min(1, 'Coverage amount must be greater than 0'),
  premium: z.number().min(1, 'Premium must be greater than 0'),
  startDate: z.date(),
  endDate: z.date(),
  clientId: z.string().min(1, 'Client is required'),
  insurerId: z.string().optional(),
  status: z.nativeEnum(PolicyStatus).default(PolicyStatus.Draft),
});

type PolicyFormData = z.infer<typeof policySchema>;

export const PolicyForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [clients, setClients] = useState<any[]>([]);
  const [insurers, setInsurers] = useState<any[]>([]);
  const isEdit = !!id;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<PolicyFormData>({
    resolver: zodResolver(policySchema),
    defaultValues: {
      status: PolicyStatus.Draft,
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    },
  });

  const startDate = watch('startDate');
  const coverageAmount = watch('coverageAmount');
  const premium = watch('premium');

  useEffect(() => {
    loadClients();
    loadInsurers();
    if (isEdit) loadPolicy();
  }, [id]);

  const loadClients = async () => {
    try {
      // TODO: Implement client service
      // const response = await clientService.getClients();
      // setClients(response.data);
      setClients([
        { id: '1', name: 'Client 1', email: 'client1@test.com' },
        { id: '2', name: 'Client 2', email: 'client2@test.com' },
      ]);
    } catch (error) {
      console.error('Failed to load clients:', error);
    }
  };

  const loadInsurers = async () => {
    try {
      // TODO: Implement insurer service
      setInsurers([
        { id: '3', name: 'Insurer 1', email: 'insurer1@test.com' },
        { id: '4', name: 'Insurer 2', email: 'insurer2@test.com' },
      ]);
    } catch (error) {
      console.error('Failed to load insurers:', error);
    }
  };

  const loadPolicy = async () => {
    try {
      setLoading(true);
      const policy = await policyService.getPolicy(id!);
      reset({
        ...policy,
        startDate: new Date(policy.startDate),
        endDate: new Date(policy.endDate),
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load policy');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: PolicyFormData) => {
    setLoading(true);
    setError('');
    try {
      if (isEdit) {
        await policyService.updatePolicy(id!, data);
      } else {
        await policyService.createPolicy(data);
      }
      navigate('/policies');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to save policy');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {isEdit ? 'Edit Policy' : 'New Policy'}
      </Typography>

      <Paper sx={{ p: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <Divider />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="policyNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Policy Number"
                    error={!!errors.policyNumber}
                    helperText={errors.policyNumber?.message}
                    disabled={loading}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Policy Name"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    disabled={loading}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={3}
                    label="Description"
                    disabled={loading}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Policy Type"
                    error={!!errors.type}
                    helperText={errors.type?.message}
                    disabled={loading}
                  >
                    {Object.values(PolicyType).map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Status"
                    disabled={loading}
                  >
                    {Object.values(PolicyStatus).map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            {/* Dates */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Policy Period
              </Typography>
              <Divider />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Start Date"
                    value={field.value}
                    onChange={field.onChange}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.startDate,
                        helperText: errors.startDate?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="End Date"
                    value={field.value}
                    onChange={field.onChange}
                    minDate={startDate}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.endDate,
                        helperText: errors.endDate?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>

            {/* Financials */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Financial Details
              </Typography>
              <Divider />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="coverageAmount"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    fullWidth
                    label="Coverage Amount ($)"
                    error={!!errors.coverageAmount}
                    helperText={errors.coverageAmount?.message}
                    disabled={loading}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="premium"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    fullWidth
                    label="Premium ($)"
                    error={!!errors.premium}
                    helperText={errors.premium?.message}
                    disabled={loading}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                    }}
                  />
                )}
              />
            </Grid>

            {/* Parties */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Parties Involved
              </Typography>
              <Divider />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="clientId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Client"
                    error={!!errors.clientId}
                    helperText={errors.clientId?.message}
                    disabled={loading}
                  >
                    {clients.map((client) => (
                      <MenuItem key={client.id} value={client.id}>
                        {client.name} ({client.email})
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="insurerId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Insurer (Optional)"
                    disabled={loading}
                  >
                    <MenuItem value="">None</MenuItem>
                    {insurers.map((insurer) => (
                      <MenuItem key={insurer.id} value={insurer.id}>
                        {insurer.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            {/* Summary Card */}
            {coverageAmount > 0 && premium > 0 && (
              <Grid item xs={12}>
                <Card sx={{ mt: 2, bgcolor: 'primary.light', color: 'white' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Policy Summary
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2">Coverage Amount</Typography>
                        <Typography variant="h6">
                          ${coverageAmount.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">Annual Premium</Typography>
                        <Typography variant="h6">
                          ${premium.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2">
                          Premium to Coverage Ratio: {((premium / coverageAmount) * 100).toFixed(2)}%
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Submit Buttons */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/policies')}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading && <CircularProgress size={20} />}
                >
                  {loading ? 'Saving...' : isEdit ? 'Update Policy' : 'Create Policy'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};
