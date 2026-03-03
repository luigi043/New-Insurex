import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    TextField,
    FormControlLabel,
    Checkbox,
    CircularProgress,
    Alert
} from '@mui/material';
import { Send } from '@mui/icons-material';
import { Invoice } from '../../types/billing.types';
import { useNotification } from '../../hooks/useNotification';

interface PaymentReminderDialogProps {
    open: boolean;
    onClose: () => void;
    invoice: Invoice | any | null;
}

export const PaymentReminderDialog: React.FC<PaymentReminderDialogProps> = ({
    open,
    onClose,
    invoice
}) => {
    const { showNotification } = useNotification();
    const [loading, setLoading] = useState(false);
    const [sendCopy, setSendCopy] = useState(true);
    const [customMessage, setCustomMessage] = useState('');

    if (!invoice) return null;

    const handleSendReminder = async () => {
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            showNotification('success', `Lembrete enviado com sucesso para ${invoice.holderEmail || 'cliente'}`);
            onClose();
        } catch (err) {
            showNotification('error', 'Erro ao enviar lembrete de pagamento');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Send color="primary" />
                Enviar Lembrete de Pagamento
            </DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 1 }}>
                    <Alert severity="info" sx={{ mb: 2 }}>
                        Esta ação enviará um e-mail de notificação para o cliente sobre a fatura pendente.
                    </Alert>

                    <Typography variant="subtitle2" gutterBottom>Detalhes da Fatura:</Typography>
                    <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1, mb: 2 }}>
                        <Typography variant="body2"><strong>Número:</strong> {invoice.invoiceNumber}</Typography>
                        <Typography variant="body2"><strong>Cliente:</strong> {invoice.holderName || 'N/A'}</Typography>
                        <Typography variant="body2"><strong>Vencimento:</strong> {new Date(invoice.dueDate).toLocaleDateString('pt-BR')}</Typography>
                        <Typography variant="body2"><strong>Valor:</strong> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(invoice.amount)}</Typography>
                    </Box>

                    <TextField
                        fullWidth
                        label="Mensagem Personalizada (Opcional)"
                        multiline
                        rows={3}
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        placeholder="A mensagem padrão será enviada se deixado em branco..."
                        sx={{ mb: 2 }}
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={sendCopy}
                                onChange={(e) => setSendCopy(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Enviar cópia para o meu e-mail"
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>Cancelar</Button>
                <Button
                    variant="contained"
                    onClick={handleSendReminder}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <Send />}
                >
                    Enviar Agora
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PaymentReminderDialog;
