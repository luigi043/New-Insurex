// ─────────────────────────────────────────────────────────────────────────────
// src/pages/auth/ForgotPassword.tsx
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from 'react';
import { Box, Button, Card, CardContent, TextField, Typography, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import apiClient from '../../services/apiClient';

const schema = z.object({ email: z.string().email('Enter a valid email') });
type Form = z.infer<typeof schema>;

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async ({ email }: Form) => {
    await apiClient.post('/api/auth/forgot-password', { email });
    setSent(true); // always show success (don't leak whether email exists)
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="grey.100">
      <Card sx={{ width: 400 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight={700} mb={1}>Forgot Password</Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Enter your email and we'll send a reset link.
          </Typography>

          {sent ? (
            <Alert severity="success">
              If that email is registered, you'll receive a password reset link shortly.
            </Alert>
          ) : (
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <TextField
                {...register('email')}
                label="Email" type="email" fullWidth sx={{ mb: 2 }}
                error={!!errors.email} helperText={errors.email?.message}
              />
              <Button type="submit" variant="contained" fullWidth disabled={isSubmitting}>
                {isSubmitting ? 'Sending…' : 'Send Reset Link'}
              </Button>
            </Box>
          )}

          <Typography variant="body2" mt={2} textAlign="center">
            <Link to="/login">Back to login</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// src/pages/auth/ResetPassword.tsx
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from 'react';
import { Box, Button, Card, CardContent, IconButton, InputAdornment,
  TextField, Typography, Alert } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import apiClient from '../../services/apiClient';

const schema = z.object({
  newPassword:     z.string().min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  confirmPassword: z.string(),
}).refine(d => d.newPassword === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});
type Form = z.infer<typeof schema>;

export default function ResetPassword() {
  const [params]  = useSearchParams();
  const navigate  = useNavigate();
  const [show, setShow]       = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');

  const token = params.get('token') ?? '';
  const email = params.get('email') ?? '';

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async ({ newPassword }: Form) => {
    setApiError('');
    try {
      await apiClient.post('/api/auth/reset-password', { email, token, newPassword });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (e: any) {
      setApiError(e?.response?.data?.message ?? 'Reset failed. The link may have expired.');
    }
  };

  if (!token || !email) {
    return (
      <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
        <Alert severity="error">Invalid or missing reset link. Please request a new one.</Alert>
      </Box>
    );
  }

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="grey.100">
      <Card sx={{ width: 400 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight={700} mb={1}>Reset Password</Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Choose a new password for <strong>{email}</strong>
          </Typography>

          {success ? (
            <Alert severity="success">
              Password reset! Redirecting to login…
            </Alert>
          ) : (
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              {apiError && <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>}

              <TextField
                {...register('newPassword')}
                label="New Password" type={show ? 'text' : 'password'} fullWidth sx={{ mb: 2 }}
                error={!!errors.newPassword} helperText={errors.newPassword?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setShow(s => !s)} edge="end">
                        {show ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                {...register('confirmPassword')}
                label="Confirm Password" type={show ? 'text' : 'password'} fullWidth sx={{ mb: 3 }}
                error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message}
              />
              <Button type="submit" variant="contained" fullWidth disabled={isSubmitting}>
                {isSubmitting ? 'Resetting…' : 'Reset Password'}
              </Button>
            </Box>
          )}

          <Typography variant="body2" mt={2} textAlign="center">
            <Link to="/login">Back to login</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}