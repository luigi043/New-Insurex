import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    IconButton,
    Chip
} from '@mui/material';
import { Add, Delete, Edit, TrendingUp } from '@mui/icons-material';
import { CommissionRate, CreateCommissionRateData } from '../../types/partner.types';
import { usePartners } from '../../hooks/usePartners';
import { useNotification } from '../../hooks/useNotification';
import { formatDate } from '../../utils/formatters';

interface CommissionConfigProps {
    partnerId: string;
}

const categories = [
    'Auto',
    'Vida',
    'Residencial',
    'Empresarial',
    'Saúde',
    'Outros'
];

export const CommissionConfig: React.FC<CommissionConfigProps> = ({ partnerId }) => {
    const { getCommissions, addCommission } = usePartners({ autoFetch: false });
    const { showNotification } = useNotification();

    const [commissions, setCommissions] = useState<CommissionRate[]>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<CreateCommissionRateData>({
        partnerId,
        category: 'Auto',
        rate: 0,
        effectiveDate: new Date().toISOString().split('T')[0],
        notes: ''
    });

    useEffect(() => {
        loadCommissions();
    }, [partnerId]);

    const loadCommissions = async () => {
        try {
            const data = await getCommissions(partnerId);
            setCommissions(data);
        } catch (err) {
            showNotification('error', 'Erro ao carregar comissões');
        }
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setFormData({
            partnerId,
            category: 'Auto',
            rate: 0,
            effectiveDate: new Date().toISOString().split('T')[0],
            notes: ''
        });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const newCommission = await addCommission(formData);
            setCommissions(prev => [newCommission, ...prev]);
            showNotification('success', 'Configuração de comissão salva com sucesso!');
            handleClose();
        } catch (err) {
            showNotification('error', 'Erro ao salvar comissão');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUp color="primary" />
                    Configuração de Comissões
                </Typography>
                <Button
                    variant="contained"
                    size="small"
                    startIcon={<Add />}
                    onClick={handleOpen}
                >
                    Novo Rate
                </Button>
            </Box>

            <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Categoria</TableCell>
                            <TableCell align="center">Taxa (%)</TableCell>
                            <TableCell>Vigência</TableCell>
                            <TableCell>Notas</TableCell>
                            <TableCell align="center">Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {commissions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Nenhuma configuração de comissão encontrada.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            commissions.map((rate) => (
                                <TableRow key={rate.id}>
                                    <TableCell>
                                        <Chip label={rate.category} size="small" variant="outlined" />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography fontWeight="bold" color="primary">
                                            {rate.rate}%
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{formatDate(rate.effectiveDate)}</TableCell>
                                    <TableCell>{rate.notes || '-'}</TableCell>
                                    <TableCell align="center">
                                        <IconButton size="small">
                                            <Edit fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" color="error">
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
                <DialogTitle>Nova Taxa de Comissão</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            select
                            label="Categoria"
                            fullWidth
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            {categories.map(cat => (
                                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Taxa (%)"
                            type="number"
                            fullWidth
                            value={formData.rate}
                            onChange={(e) => setFormData({ ...formData, rate: parseFloat(e.target.value) || 0 })}
                            InputProps={{
                                endAdornment: <Typography variant="body2">%</Typography>
                            }}
                        />
                        <TextField
                            label="Data de Vigência"
                            type="date"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={formData.effectiveDate}
                            onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                        />
                        <TextField
                            label="Notas"
                            multiline
                            rows={2}
                            fullWidth
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Salvando...' : 'Salvar'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CommissionConfig;
