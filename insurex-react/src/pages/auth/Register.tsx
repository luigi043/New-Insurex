import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Grid,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch } from '../../store/hooks';
import { register } from '../../store/slices/authSlice';

const steps = ['Dados Pessoais', 'Credenciais', 'Revisão'];

const personalSchema = z.object({
  firstName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  lastName: z.string().min(2, 'Sobrenome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phoneNumber: z.string().optional(),
});

const credentialsSchema = z.object({
  password: z
    .string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[0-9]/, 'Senha deve conter pelo menos um número')
    .regex(/[^A-Za-z0-9]/, 'Senha deve conter pelo menos um caractere especial'),
  confirmPassword: z.string(),
  role: z.enum(['Client', 'Financer', 'Insurer', 'Broker']),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword'],
});

type PersonalData = z.infer<typeof personalSchema>;
type CredentialsData = z.infer<typeof credentialsSchema>;

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [personalData, setPersonalData] = useState<PersonalData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });

  const [credentialsData, setCredentialsData] = useState<CredentialsData>({
    password: '',
    confirmPassword: '',
    role: 'Client',
  });

  const {
    register: registerPersonal,
    handleSubmit: handleSubmitPersonal,
    formState: { errors: personalErrors },
  } = useForm<PersonalData>({
    resolver: zodResolver(personalSchema),
    defaultValues: personalData,
  });

  const {
    control: controlCredentials,
    register: registerCredentials,
    handleSubmit: handleSubmitCredentials,
    formState: { errors: credentialsErrors },
  } = useForm<CredentialsData>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: credentialsData,
  });

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const onPersonalSubmit = (data: PersonalData) => {
    setPersonalData(data);
    handleNext();
  };

  const onCredentialsSubmit = (data: CredentialsData) => {
    setCredentialsData(data);
    handleNext();
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await dispatch(register({
        ...personalData,
        ...credentialsData,
        confirmPassword: undefined,
      })).unwrap();

      navigate('/login', { 
        state: { 
          message: 'Conta criada com sucesso! Faça login para continuar.' 
        } 
      });
    } catch (err: any) {
      setError(err.message || 'Falha no registro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box component="form" onSubmit={handleSubmitPersonal(onPersonalSubmit)} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Nome"
                  error={!!personalErrors.firstName}
                  helperText={personalErrors.firstName?.message}
                  disabled={loading}
                  {...registerPersonal('firstName')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Sobrenome"
                  error={!!personalErrors.lastName}
                  helperText={personalErrors.lastName?.message}
                  disabled={loading}
                  {...registerPersonal('lastName')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Email"
                  type="email"
                  error={!!personalErrors.email}
                  helperText={personalErrors.email?.message}
                  disabled={loading}
                  {...registerPersonal('email')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Telefone"
                  error={!!personalErrors.phoneNumber}
                  helperText={personalErrors.phoneNumber?.message}
                  disabled={loading}
                  {...registerPersonal('phoneNumber')}
                />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
              >
                Próximo
              </Button>
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box component="form" onSubmit={handleSubmitCredentials(onCredentialsSubmit)} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Senha"
                  type={showPassword ? 'text' : 'password'}
                  error={!!credentialsErrors.password}
                  helperText={credentialsErrors.password?.message}
                  disabled={loading}
                  {...registerCredentials('password')}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Confirmar Senha"
                  type={showConfirmPassword ? 'text' : 'password'}
                  error={!!credentialsErrors.confirmPassword}
                  helperText={credentialsErrors.confirmPassword?.message}
                  disabled={loading}
                  {...registerCredentials('confirmPassword')}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="role"
                  control={controlCredentials}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!credentialsErrors.role}>
                      <InputLabel>Tipo de Usuário</InputLabel>
                      <Select {...field} label="Tipo de Usuário">
                        <MenuItem value="Client">Cliente</MenuItem>
                        <MenuItem value="Financer">Financiador</MenuItem>
                        <MenuItem value="Insurer">Seguradora</MenuItem>
                        <MenuItem value="Broker">Corretor</MenuItem>
                      </Select>
                      {credentialsErrors.role && (
                        <FormHelperText>{credentialsErrors.role.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button onClick={handleBack}>Voltar</Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
              >
                Próximo
              </Button>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Revise seus dados
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Dados Pessoais
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Nome:
                  </Typography>
                  <Typography variant="body1">
                    {personalData.firstName} {personalData.lastName}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Email:
                  </Typography>
                  <Typography variant="body1">{personalData.email}</Typography>
                </Grid>
                {personalData.phoneNumber && (
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Telefone:
                    </Typography>
                    <Typography variant="body1">{personalData.phoneNumber}</Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Credenciais
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Tipo de Usuário:
                  </Typography>
                  <Typography variant="body1">
                    {credentialsData.role === 'Client' && 'Cliente'}
                    {credentialsData.role === 'Financer' && 'Financiador'}
                    {credentialsData.role === 'Insurer' && 'Seguradora'}
                    {credentialsData.role === 'Broker' && 'Corretor'}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Ao criar sua conta, você concorda com nossos{' '}
              <Link to="/terms">Termos de Uso</Link> e{' '}
              <Link to="/privacy">Política de Privacidade</Link>.
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button onClick={handleBack}>Voltar</Button>
              <Button
                variant="contained"
                onClick={handleFinalSubmit}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Criar Conta'}
              </Button>
            </Box>
          </Box>
        );

      default:
        return 'Passo desconhecido';
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 4,
          marginBottom: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 2,
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography
              component="h1"
              variant="h4"
              sx={{ fontWeight: 'bold', color: 'primary.main' }}
            >
              InsureX
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Crie sua conta gratuitamente
            </Typography>
          </Box>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {getStepContent(activeStep)}

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Já tem uma conta?{' '}
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Typography component="span" variant="body2" color="primary">
                  Faça login
                </Typography>
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
