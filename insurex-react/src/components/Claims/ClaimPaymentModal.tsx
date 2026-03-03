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
    CircularProgress,
    InputAdornment
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Claim } from '../../types/claim.types';
import { useClaims } from '../../hooks/useClaims';
import { format } from 'date-fns';

interface ClaimPaymentModalProps {
    open: boolean;
    onClose: () => void;
    claim: Claim;
    onSuccess?: (settledClaim: Claim) => void;
}

const schema = yup.object().shape({
    settlementAmount: yup.number().required('Valor do pagamento é obrigatório').positive('Deve ser um valor positivo'),
    paymentDate: yup.string().required('Data do pagamento é obrigatória'),
    notes: yup.string(),
});

export const ClaimPaymentModal: React.FC<ClaimPaymentModalProps> = ({
    open,
    onClose,
    claim,
    onSuccess
}) => {
    const { settleClaim, isLoading, error } = useClaims({ autoFetch: false });

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            settlementAmount: claim.approvedAmount || claim.claimedAmount,
            paymentDate: format(new Date(), "yyyy-MM-dd"),
            notes: `Pagamento referente ao sinistro ${claim.claimNumber}`,
        }
    });

    const onFormSubmit = async (data: any) => {
        try {
            const settled = await settleClaim(claim.id, data.settlementAmount, data.notes);
            if (onSuccess) onSuccess(settled);
            onClose();
        } catch (err) {
            // Error is handled by useClaims
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Processar Pagamento de Sinistro - {claim.claimNumber}</DialogTitle>
            <form onSubmit={handleSubmit(onFormSubmit)}>
                <DialogContent dividers>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Confirme os detalhes do pagamento para liquidar este sinistro.
                    </Typography>

                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="settlementAmount"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Valor do Pagamento"
                                        type="number"
                                        fullWidth
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                        }}
                                        error={!!errors.settlementAmount}
                                        helperText={errors.settlementAmount?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="paymentDate"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Data do Pagamento"
                                        type="date"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        error={!!errors.paymentDate}
                                        helperText={errors.paymentDate?.message}
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
                                        label="Observações do Pagamento"
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
                        color="success"
                        disabled={isLoading}
                        startIcon={isLoading ? <CircularProgress size={20} /> : null}
                    >
                        Confirmar Pagamento
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ClaimPaymentModal;
