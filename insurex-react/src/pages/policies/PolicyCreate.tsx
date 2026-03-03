// src/pages/policies/PolicyCreate.tsx
import { useState } from 'react';
import {
  Box, Button, Card, CardContent, Divider, Grid, MenuItem,
  Stack, Step, StepLabel, Stepper, TextField, Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePolicies } from '../../hooks/usePolicies';

// ─── Schema ──────────────────────────────────────────────────────────────────
const schema = z.object({
  // Step 1 – Basic Info
  insuredName:   z.string().min(2, 'Required'),
  insuredNif:    z.string().length(9, 'NIF must be 9 digits'),
  insuredEmail:  z.string().email('Invalid email'),
  insuredPhone:  z.string().min(9, 'Required'),
  type:          z.string().min(1, 'Required'),
  // Step 2 – Coverage
  startDate:     z.string().min(1, 'Required'),
  endDate:       z.string().min(1, 'Required'),
  premium:       z.coerce.number().min(0.01, 'Must be > 0'),
  coverageLimit: z.coerce.number().min(1, 'Required'),
  deductible:    z.coerce.number().min(0),
  description:   z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const POLICY_TYPES = ['Auto', 'Home', 'Life', 'Health', 'Business', 'Travel', 'Liability'];
const STEPS = ['Insured Details', 'Coverage & Dates', 'Review & Submit'];

// ─── Component ───────────────────────────────────────────────────────────────
export default function PolicyCreate() {
  const navigate = useNavigate();
  const { createPolicy } = usePolicies({});
  const [activeStep, setActiveStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit, trigger, getValues,
    formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      insuredName: '', insuredNif: '', insuredEmail: '', insuredPhone: '',
      type: '', startDate: '', endDate: '',
      premium: '' as any, coverageLimit: '' as any, deductible: 0, description: '',
    },
  });

  const stepFields: (keyof FormValues)[][] = [
    ['insuredName', 'insuredNif', 'insuredEmail', 'insuredPhone', 'type'],
    ['startDate', 'endDate', 'premium', 'coverageLimit', 'deductible'],
  ];

  const handleNext = async () => {
    const valid = await trigger(stepFields[activeStep]);
    if (valid) setActiveStep(s => s + 1);
  };

  const onSubmit: SubmitHandler<FormValues> = async data => {
    setSubmitting(true);
    try {
      const policy = await createPolicy(data);
      navigate(`/policies/${policy.id}`);
    } finally {
      setSubmitting(false);
    }
  };

  const vals = getValues();

  return (
    <Box maxWidth={760} mx="auto">
      <Typography variant="h5" fontWeight={600} mb={3}>New Policy</Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {STEPS.map(s => <Step key={s}><StepLabel>{s}</StepLabel></Step>)}
      </Stepper>

      <Card variant="outlined">
        <CardContent component="form" onSubmit={handleSubmit(onSubmit)}>
          {/* Step 1 */}
          {activeStep === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Controller name="insuredName" control={control} render={({ field }) => (
                  <TextField {...field} label="Insured Name" fullWidth error={!!errors.insuredName}
                    helperText={errors.insuredName?.message} />
                )} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller name="insuredNif" control={control} render={({ field }) => (
                  <TextField {...field} label="NIF" fullWidth error={!!errors.insuredNif}
                    helperText={errors.insuredNif?.message} inputProps={{ maxLength: 9 }} />
                )} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller name="insuredEmail" control={control} render={({ field }) => (
                  <TextField {...field} label="Email" type="email" fullWidth error={!!errors.insuredEmail}
                    helperText={errors.insuredEmail?.message} />
                )} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller name="insuredPhone" control={control} render={({ field }) => (
                  <TextField {...field} label="Phone" fullWidth error={!!errors.insuredPhone}
                    helperText={errors.insuredPhone?.message} />
                )} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller name="type" control={control} render={({ field }) => (
                  <TextField {...field} select label="Policy Type" fullWidth error={!!errors.type}
                    helperText={errors.type?.message}>
                    {POLICY_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                  </TextField>
                )} />
              </Grid>
            </Grid>
          )}

          {/* Step 2 */}
          {activeStep === 1 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Controller name="startDate" control={control} render={({ field }) => (
                  <TextField {...field} label="Start Date" type="date" fullWidth
                    InputLabelProps={{ shrink: true }} error={!!errors.startDate}
                    helperText={errors.startDate?.message} />
                )} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller name="endDate" control={control} render={({ field }) => (
                  <TextField {...field} label="End Date" type="date" fullWidth
                    InputLabelProps={{ shrink: true }} error={!!errors.endDate}
                    helperText={errors.endDate?.message} />
                )} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controller name="premium" control={control} render={({ field }) => (
                  <TextField {...field} label="Annual Premium (€)" type="number" fullWidth
                    error={!!errors.premium} helperText={errors.premium?.message} />
                )} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controller name="coverageLimit" control={control} render={({ field }) => (
                  <TextField {...field} label="Coverage Limit (€)" type="number" fullWidth
                    error={!!errors.coverageLimit} helperText={errors.coverageLimit?.message} />
                )} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controller name="deductible" control={control} render={({ field }) => (
                  <TextField {...field} label="Deductible (€)" type="number" fullWidth
                    error={!!errors.deductible} helperText={errors.deductible?.message} />
                )} />
              </Grid>
              <Grid item xs={12}>
                <Controller name="description" control={control} render={({ field }) => (
                  <TextField {...field} label="Notes (optional)" multiline rows={3} fullWidth />
                )} />
              </Grid>
            </Grid>
          )}

          {/* Step 3 – Review */}
          {activeStep === 2 && (
            <Box>
              <Typography variant="subtitle1" fontWeight={600} mb={1}>Insured Details</Typography>
              <Grid container spacing={1} mb={2}>
                {[
                  ['Name',  vals.insuredName],
                  ['NIF',   vals.insuredNif],
                  ['Email', vals.insuredEmail],
                  ['Phone', vals.insuredPhone],
                  ['Type',  vals.type],
                ].map(([k, v]) => (
                  <Grid item xs={6} key={k}>
                    <Typography variant="body2" color="text.secondary">{k}</Typography>
                    <Typography variant="body1">{v}</Typography>
                  </Grid>
                ))}
              </Grid>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="subtitle1" fontWeight={600} mb={1}>Coverage</Typography>
              <Grid container spacing={1}>
                {[
                  ['Start Date',      vals.startDate],
                  ['End Date',        vals.endDate],
                  ['Premium',         `€ ${vals.premium}`],
                  ['Coverage Limit',  `€ ${vals.coverageLimit}`],
                  ['Deductible',      `€ ${vals.deductible}`],
                ].map(([k, v]) => (
                  <Grid item xs={6} key={k}>
                    <Typography variant="body2" color="text.secondary">{k}</Typography>
                    <Typography variant="body1">{v}</Typography>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Navigation */}
          <Stack direction="row" justifyContent="space-between" mt={4}>
            <Button onClick={() => activeStep === 0 ? navigate('/policies') : setActiveStep(s => s - 1)}
              disabled={submitting}>
              {activeStep === 0 ? 'Cancel' : 'Back'}
            </Button>
            {activeStep < 2
              ? <Button variant="contained" onClick={handleNext}>Next</Button>
              : <Button variant="contained" type="submit" disabled={submitting}>
                  {submitting ? 'Creating…' : 'Create Policy'}
                </Button>
            }
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}