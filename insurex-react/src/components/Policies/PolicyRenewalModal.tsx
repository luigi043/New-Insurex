import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    Typography,
    Alert,
    CircularProgress
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Policy, CreatePolicyData } from '../../types/policy.types';
import { usePolicies } from '../../hooks/usePolicies';
import { addYears, format } from 'date-fns';

interface PolicyRenewalModalProps {
    open: boolean;
    onClose: () => void;
    policy: Policy;
    onSuccess?: (renewedPolicy: Policy) => void;
}

const schema = yup.object().shape({
    premium: yup.number().required('Prêmio é obrigatório').positive('Deve ser um valor positivo'),
    insuredAmount: yup.number().required('Valor segurado é obrigatório').positive('Deve ser um valor positivo'),
    startDate: yup.string().required('Data de início é obrigatória'),
    endDate: yup.string().required('Data de término é obrigatória'),
    notes: yup.string(),
});

export const PolicyRenewalModal: React.FC<PolicyRenewalModalProps> = ({
    open,
    onClose,
    policy,
    onSuccess
}) => {
    const { renewPolicy, isLoading, error, clearError } = usePolicies({ autoFetch: false });

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            premium: policy.premium,
            insuredAmount: policy.insuredAmount,
            startDate: format(new Date(policy.endDate), "yyyy-MM-dd"),
            endDate: format(addYears(new Date(policy.endDate), 1), "yyyy-MM-dd"),
            notes: `Renovação da apólice ${policy.policyNumber}`,
        }
    });

    const onFormSubmit = async (data: any) => {
        try {
            const renewed = await renewPolicy(policy.id, data as Partial<CreatePolicyData>);
            if (onSuccess) onSuccess(renewed);
            onClose();
        } catch (err) {
            // Error is handled by usePolicies
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Renovar Apólice - {policy.policyNumber}</DialogTitle>
            <form onSubmit={handleSubmit(onFormSubmit)}>
                <DialogContent dividers>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Especifique os detalhes para a renovação da apólice. As datas foram pré-preenchidas para um ano a partir do término atual.
                    </Typography>

                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="insuredAmount"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Valor Segurado"
                                        type="number"
                                        fullWidth
                                        error={!!errors.insuredAmount}
                                        helperText={errors.insuredAmount?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="premium"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Prêmio"
                                        type="number"
                                        fullWidth
                                        error={!!errors.premium}
                                        helperText={errors.premium?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="startDate"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Data de Início"
                                        type="date"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        error={!!errors.startDate}
                                        helperText={errors.startDate?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="endDate"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Data de Término"
                                        type="date"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        error={!!errors.endDate}
                                        helperText={errors.endDate?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name="notes"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Notas de Renovação"
                                        multiline
                                        rows={3}
                                        fullWidth
                                        error={!!errors.notes}
                                        helperText={errors.notes?.message}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} disabled={isLoading}>Cancelar</Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isLoading}
                        startIcon={isLoading ? <CircularProgress size={20} /> : null}
                    >
                        Confirmar Renovação
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default PolicyRenewalModal;
