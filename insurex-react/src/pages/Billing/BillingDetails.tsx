import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Divider,
    Button,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Alert,
    Breadcrumbs,
    Link,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    ListItemIcon
} from '@mui/material';
import {
    ArrowBack,
    PictureAsPdf,
    Send,
    Description,
    Event,
    Person,
    Policy,
    History
} from '@mui/icons-material';
import { useBilling } from '../../hooks/useBilling';
import { Invoice, InvoiceStatus } from '../../types/billing.types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useNotification } from '../../hooks/useNotification';
import { generateInvoicePDF } from '../../utils/InvoicePDFGenerator';
import { PaymentReminderDialog } from '../../components/Billing/PaymentReminderDialog';

export const BillingDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const { getInvoice, loading, error, generateInvoice } = useBilling({ autoFetch: false });

    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [reminderOpen, setReminderOpen] = useState(false);

    useEffect(() => {
        if (id) {
            loadInvoice();
        }
    }, [id]);

    const loadInvoice = async () => {
        try {
            if (id) {
                const data = await getInvoice(id);
                setInvoice(data);
            }
        } catch (err) {
            showNotification('error', 'Erro ao carregar detalhes da fatura');
        }
    };

    const handleGeneratePdf = () => {
        if (invoice) {
            generateInvoicePDF(invoice);
            showNotification('success', 'PDF gerado com sucesso!');
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !invoice) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">{error || 'Fatura não encontrada'}</Alert>
                <Button startIcon={<ArrowBack />} onClick={() => navigate('/billing')} sx={{ mt: 2 }}>
                    Voltar para Lista
                </Button>
            </Box>
        );
    }

    const statusColors: Record<string, 'success' | 'error' | 'warning' | 'default' | 'info'> = {
        [InvoiceStatus.PAID]: 'success',
        [InvoiceStatus.SENT]: 'warning',
        [InvoiceStatus.OVERDUE]: 'error',
        [InvoiceStatus.CANCELLED]: 'default',
        [InvoiceStatus.PARTIALLY_PAID]: 'info'
    };

    return (
        <Box>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Breadcrumbs sx={{ mb: 1 }}>
                        <Link component="button" variant="body2" onClick={() => navigate('/billing')} underline="hover" color="inherit">
                            Faturamento
                        </Link>
                        <Typography variant="body2" color="text.primary">Detalhes</Typography>
                    </Breadcrumbs>
                    <Typography variant="h4">Fatura {invoice.invoiceNumber}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate('/billing')}>
                        Voltar
                    </Button>
                    <Button variant="contained" color="primary" startIcon={<PictureAsPdf />} onClick={handleGeneratePdf}>
                        Baixar PDF
                    </Button>
                    {invoice.status === InvoiceStatus.OVERDUE && (
                        <Button variant="contained" color="warning" startIcon={<Send />} onClick={() => setReminderOpen(true)}>
                            Enviar Lembrete
                        </Button>
                    )}
                </Box>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                            <Typography variant="h6">Itens da Fatura</Typography>
                            <Chip
                                label={invoice.status}
                                color={statusColors[invoice.status] || 'default'}
                                sx={{ fontWeight: 'bold' }}
                            />
                        </Box>

                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Descrição</TableCell>
                                        <TableCell align="center">Qtd</TableCell>
                                        <TableCell align="right">Preço Unit.</TableCell>
                                        <TableCell align="right">Total</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {invoice.items && invoice.items.length > 0 ? (
                                        invoice.items.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{item.description}</TableCell>
                                                <TableCell align="center">{item.quantity}</TableCell>
                                                <TableCell align="right">{formatCurrency(item.unitPrice)}</TableCell>
                                                <TableCell align="right">{formatCurrency(item.totalPrice)}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell>{invoice.description || 'Premium'}</TableCell>
                                            <TableCell align="center">1</TableCell>
                                            <TableCell align="right">{formatCurrency(invoice.amount)}</TableCell>
                                            <TableCell align="right">{formatCurrency(invoice.amount)}</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                            <Box sx={{ width: 250 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography color="text.secondary">Subtotal:</Typography>
                                    <Typography>{formatCurrency(invoice.amount)}</Typography>
                                </Box>
                                {invoice.taxAmount && (
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography color="text.secondary">Impostos:</Typography>
                                        <Typography>{formatCurrency(invoice.taxAmount)}</Typography>
                                    </Box>
                                )}
                                {invoice.discountAmount && (
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography color="text.secondary">Desconto:</Typography>
                                        <Typography color="error">-{formatCurrency(invoice.discountAmount)}</Typography>
                                    </Box>
                                )}
                                <Divider sx={{ my: 1 }} />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="h6">Total:</Typography>
                                    <Typography variant="h6" color="primary">{formatCurrency(invoice.totalAmount || invoice.amount)}</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Paper>

                    {invoice.payments && invoice.payments.length > 0 && (
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>Histórico de Pagamentos</Typography>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Data</TableCell>
                                            <TableCell>Método</TableCell>
                                            <TableCell>Referência</TableCell>
                                            <TableCell align="right">Valor</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {invoice.payments.map((payment) => (
                                            <TableRow key={payment.id}>
                                                <TableCell>{formatDate(payment.paidAt)}</TableCell>
                                                <TableCell>{payment.method}</TableCell>
                                                <TableCell>{payment.reference || 'N/A'}</TableCell>
                                                <TableCell align="right">{formatCurrency(payment.amount)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    )}
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Informações do Cliente</Typography>
                            <List disablePadding>
                                <ListItem disableGutters>
                                    <ListItemIcon><Person color="primary" /></ListItemIcon>
                                    <ListItemText primary={invoice.holderName} secondary="Segurado" />
                                </ListItem>
                                <ListItem disableGutters>
                                    <ListItemIcon><Description color="primary" /></ListItemIcon>
                                    <ListItemText primary={invoice.holderEmail} secondary="E-mail" />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>

                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Datas Importantes</Typography>
                            <List disablePadding>
                                <ListItem disableGutters>
                                    <ListItemIcon><Event color="primary" /></ListItemIcon>
                                    <ListItemText primary={formatDate(invoice.issueDate || invoice.createdAt)} secondary="Data de Emissão" />
                                </ListItem>
                                <ListItem disableGutters>
                                    <ListItemIcon><Event color="error" /></ListItemIcon>
                                    <ListItemText primary={formatDate(invoice.dueDate)} secondary="Data de Vencimento" />
                                </ListItem>
                                {invoice.paidDate && (
                                    <ListItem disableGutters>
                                        <ListItemIcon><Event color="success" /></ListItemIcon>
                                        <ListItemText primary={formatDate(invoice.paidDate)} secondary="Data de Pagamento" />
                                    </ListItem>
                                )}
                            </List>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Referência</Typography>
                            <List disablePadding>
                                <ListItem disableGutters component="button" onClick={() => navigate(`/policies/${invoice.policyId}`)} sx={{ width: '100%', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
                                    <ListItemIcon><Policy color="primary" /></ListItemIcon>
                                    <ListItemText primary={invoice.policyNumber} secondary="Número da Apólice" />
                                </ListItem>
                                <ListItem disableGutters>
                                    <ListItemIcon><History color="primary" /></ListItemIcon>
                                    <ListItemText primary={invoice.type} secondary="Tipo de Faturamento" />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <PaymentReminderDialog
                open={reminderOpen}
                onClose={() => setReminderOpen(false)}
                invoice={invoice}
            />
        </Box>
    );
};

export default BillingDetails;
