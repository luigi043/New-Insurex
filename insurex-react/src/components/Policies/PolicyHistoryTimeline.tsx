import { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Paper,
    Zoom,
    Tooltip
} from '@mui/material';
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineOppositeContent
} from '@mui/lab';
import {
    CheckCircle,
    Cancel,
    PauseCircle,
    History,
    Edit,
    AddCircle,
    Autorenew,
    Person
} from '@mui/icons-material';
import { usePolicies } from '../../hooks/usePolicies';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PolicyHistoryTimelineProps {
    policyId: string;
}

const getActionStyles = (action: string) => {
    switch (action.toUpperCase()) {
        case 'CREATE':
        case 'CREATED':
            return { color: 'primary', icon: <AddCircle />, label: 'Criação' };
        case 'UPDATE':
        case 'UPDATED':
            return { color: 'info', icon: <Edit />, label: 'Atualização' };
        case 'APPROVE':
        case 'APPROVED':
            return { color: 'success', icon: <CheckCircle />, label: 'Aprovação' };
        case 'CANCEL':
        case 'CANCELLED':
            return { color: 'error', icon: <Cancel />, label: 'Cancelamento' };
        case 'SUSPEND':
        case 'SUSPENDED':
            return { color: 'warning', icon: <PauseCircle />, label: 'Suspensão' };
        case 'RENEW':
        case 'RENEWED':
            return { color: 'secondary', icon: <Autorenew />, label: 'Renovação' };
        default:
            return { color: 'grey', icon: <History />, label: action };
    }
};

export const PolicyHistoryTimeline: React.FC<PolicyHistoryTimelineProps> = ({ policyId }) => {
    const { getHistory } = usePolicies({ autoFetch: false });
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await getHistory(policyId);
                setHistory(data);
            } catch (err) {
                console.error('Failed to fetch policy history', err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [policyId, getHistory]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={5}>
                <CircularProgress size={30} thickness={4} />
            </Box>
        );
    }

    if (history.length === 0) {
        return (
            <Box textAlign="center" py={5} px={2}>
                <History sx={{ fontSize: 48, color: 'text.disabled', opacity: 0.5, mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                    Nenhum histórico disponível para esta apólice.
                </Typography>
            </Box>
        );
    }

    return (
        <Timeline position="right" sx={{ p: 0 }}>
            {history.map((event, index) => {
                const style = getActionStyles(event.action);
                return (
                    <Zoom in={true} key={event.id || index} style={{ transitionDelay: `${index * 100}ms` }}>
                        <TimelineItem>
                            <TimelineOppositeContent
                                sx={{ m: 'auto 0', flex: 0.2, textAlign: 'right' }}
                                color="text.secondary"
                            >
                                <Typography variant="caption" display="block">
                                    {format(new Date(event.timestamp), 'dd MMM', { locale: ptBR })}
                                </Typography>
                                <Typography variant="caption" display="block">
                                    {format(new Date(event.timestamp), 'HH:mm')}
                                </Typography>
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                                <TimelineConnector sx={{ bgcolor: index === 0 ? 'transparent' : 'divider' }} />
                                <TimelineDot
                                    color={style.color as any}
                                    variant={index === 0 ? 'filled' : 'outlined'}
                                    sx={{ boxShadow: 'none' }}
                                >
                                    {style.icon}
                                </TimelineDot>
                                <TimelineConnector sx={{ bgcolor: index === history.length - 1 ? 'transparent' : 'divider' }} />
                            </TimelineSeparator>
                            <TimelineContent sx={{ py: '12px', px: 2 }}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        borderRadius: 2,
                                        bgcolor: index === 0 ? 'action.hover' : 'background.paper',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            borderColor: 'primary.main',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                        }
                                    }}
                                >
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                                        <Typography variant="subtitle2" component="span" fontWeight="bold" color={`${style.color}.main`}>
                                            {style.label}
                                        </Typography>
                                        <Tooltip title={`Realizado por: ${event.userName || 'Sistema'}`}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Person sx={{ fontSize: 14, color: 'text.secondary' }} />
                                                <Typography variant="caption" color="text.secondary">
                                                    {event.userName || 'Sistema'}
                                                </Typography>
                                            </Box>
                                        </Tooltip>
                                    </Box>
                                    <Typography variant="body2" color="text.primary">
                                        {event.details?.description || event.message || `Ação ${event.action} aplicada com sucesso.`}
                                    </Typography>
                                </Paper>
                            </TimelineContent>
                        </TimelineItem>
                    </Zoom>
                );
            })}
        </Timeline>
    );
};

export default PolicyHistoryTimeline;
