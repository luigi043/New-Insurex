import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Chip,
    Paper
} from '@mui/material';
import {
    CalendarMonth,
    Person,
    EventNote,
    CheckCircle,
    Schedule,
} from '@mui/icons-material';
import { Inspection, InspectionStatus, CreateInspectionData } from '../../types/asset.types';
import { formatDate } from '../../utils/formatters';
import { useNotification } from '../../hooks/useNotification';

interface AssetInspectionSchedulerProps {
    assetId: string;
    inspections: Inspection[];
    onSchedule: (data: CreateInspectionData) => Promise<any>;
}

const statusColors: Record<InspectionStatus, 'primary' | 'info' | 'success' | 'error'> = {
    [InspectionStatus.SCHEDULED]: 'primary',
    [InspectionStatus.IN_PROGRESS]: 'info',
    [InspectionStatus.COMPLETED]: 'success',
    [InspectionStatus.CANCELLED]: 'error'
};

const statusLabels: Record<InspectionStatus, string> = {
    [InspectionStatus.SCHEDULED]: 'Agendado',
    [InspectionStatus.IN_PROGRESS]: 'Em Andamento',
    [InspectionStatus.COMPLETED]: 'Concluído',
    [InspectionStatus.CANCELLED]: 'Cancelado'
};

export const AssetInspectionScheduler: React.FC<AssetInspectionSchedulerProps> = ({
    assetId,
    inspections,
    onSchedule
}) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { showNotification } = useNotification();

    const [formData, setFormData] = useState({
        inspectorName: '',
        scheduledDate: '',
        notes: ''
    });

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setFormData({ inspectorName: '', scheduledDate: '', notes: '' });
    };

    const handleSubmit = async () => {
        if (!formData.inspectorName || !formData.scheduledDate) {
            showNotification('error', 'Por favor, preencha o nome do inspetor e a data.');
            return;
        }

        setLoading(true);
        try {
            await onSchedule({
                assetId,
                ...formData
            });
            showNotification('success', 'Inspeção agendada com sucesso!');
            handleClose();
        } catch (err) {
            showNotification('error', 'Erro ao agendar inspeção.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Próximas Inspeções</Typography>
                <Button
                    variant="contained"
                    size="small"
                    startIcon={<CalendarMonth />}
                    onClick={handleOpen}
                >
                    Agendar
                </Button>
            </Box>

            {inspections.length === 0 ? (
                <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'background.default' }}>
                    <Typography variant="body2" color="text.secondary">
                        Nenhuma inspeção agendada ou realizada.
                    </Typography>
                </Paper>
            ) : (
                <List dense>
                    {inspections.map((inspection) => (
                        <Paper key={inspection.id} variant="outlined" sx={{ mb: 1, overflow: 'hidden' }}>
                            <ListItem
                                sx={{
                                    borderLeft: 4,
                                    borderColor: `${statusColors[inspection.status]}.main`,
                                    py: 1.5
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    {inspection.status === InspectionStatus.COMPLETED ? (
                                        <CheckCircle color="success" />
                                    ) : <Schedule color="primary" />}
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="subtitle2">{inspection.inspectorName}</Typography>
                                            <Chip
                                                size="small"
                                                label={statusLabels[inspection.status]}
                                                color={statusColors[inspection.status]}
                                                sx={{ height: 20, fontSize: '0.625rem' }}
                                            />
                                        </Box>
                                    }
                                    secondary={
                                        <>
                                            <Typography variant="caption" component="span" display="block">
                                                {formatDate(inspection.scheduledDate)}
                                            </Typography>
                                            {inspection.notes && (
                                                <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                                                    {inspection.notes}
                                                </Typography>
                                            )}
                                        </>
                                    }
                                />
                            </ListItem>
                        </Paper>
                    ))}
                </List>
            )}

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
                <DialogTitle>Agendar Inspeção</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            label="Nome do Inspetor"
                            fullWidth
                            value={formData.inspectorName}
                            onChange={(e) => setFormData({ ...formData, inspectorName: e.target.value })}
                            InputProps={{
                                startAdornment: <Person sx={{ color: 'action.active', mr: 1 }} />
                            }}
                        />
                        <TextField
                            label="Data Prevista"
                            type="datetime-local"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={formData.scheduledDate}
                            onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                        />
                        <TextField
                            label="Observações"
                            multiline
                            rows={3}
                            fullWidth
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            InputProps={{
                                startAdornment: <EventNote sx={{ color: 'action.active', mr: 1, alignSelf: 'flex-start', mt: 1 }} />
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Agendando...' : 'Confirmar'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AssetInspectionScheduler;
