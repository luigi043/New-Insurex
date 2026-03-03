import React, { useState, useEffect } from 'react';
import {
    Grid,
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
    Avatar,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Button,
    LinearProgress
} from '@mui/material';
import {
    Assignment,
    AttachMoney,
    People,
    TrendingUp,
    Event,
    Description,
    ArrowForward
} from '@mui/icons-material';
import { Partner, PartnerContract, PartnerStats } from '../../types/partner.types';
import { usePartners, usePartnerStats } from '../../hooks/usePartners';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { CommissionConfig } from './CommissionConfig';

interface PartnerDashboardProps {
    partnerId: string;
}

export const PartnerDashboard: React.FC<PartnerDashboardProps> = ({ partnerId }) => {
    const { getPartner, getContracts, isLoading: partnerLoading } = usePartners({ autoFetch: false });
    const { stats, isLoading: statsLoading } = usePartnerStats();

    const [partner, setPartner] = useState<Partner | null>(null);
    const [contracts, setContracts] = useState<PartnerContract[]>([]);

    useEffect(() => {
        if (partnerId) {
            loadPartnerData();
        }
    }, [partnerId]);

    const loadPartnerData = async () => {
        try {
            const [partnerData, contractsData] = await Promise.all([
                getPartner(partnerId),
                getContracts(partnerId)
            ]);
            setPartner(partnerData);
            setContracts(contractsData || []);
        } catch (err) {
            console.error('Error loading partner details', err);
        }
    };

    if (partnerLoading || !partner) {
        return <LinearProgress />;
    }

    return (
        <Box>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
                <Avatar
                    sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: '2rem' }}
                >
                    {partner.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                    <Typography variant="h4">{partner.name}</Typography>
                    <Typography variant="body1" color="text.secondary">
                        {partner.type} • {partner.email}
                    </Typography>
                </Box>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <AttachMoney fontSize="small" />
                                <Typography variant="subtitle2">Comissões Pagas</Typography>
                            </Box>
                            <Typography variant="h5">
                                {formatCurrency(partner.commissionRate || 0)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: 'success.main' }}>
                                <Assignment fontSize="small" />
                                <Typography variant="subtitle2">Contratos Ativos</Typography>
                            </Box>
                            <Typography variant="h5">
                                {contracts.filter(c => c.status === 'ACTIVE').length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: 'info.main' }}>
                                <TrendingUp fontSize="small" />
                                <Typography variant="subtitle2">Performance Mensal</Typography>
                            </Box>
                            <Typography variant="h5">+12.5%</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: 'warning.main' }}>
                                <Event fontSize="small" />
                                <Typography variant="subtitle2">Próxima Renovação</Typography>
                            </Box>
                            <Typography variant="h5">15 Dias</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} lg={8}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <CommissionConfig partnerId={partnerId} />
                    </Paper>

                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Description color="primary" />
                            Contratos e Acordos
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <List>
                            {contracts.length === 0 ? (
                                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                                    Nenhum contrato cadastrado.
                                </Typography>
                            ) : (
                                contracts.map((contract) => (
                                    <ListItem
                                        key={contract.id}
                                        secondaryAction={
                                            <Button size="small" endIcon={<ArrowForward />}>Detalhes</Button>
                                        }
                                        sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
                                    >
                                        <ListItemIcon>
                                            <Description color={contract.status === 'ACTIVE' ? 'success' : 'disabled'} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={contract.contractNumber}
                                            secondary={`Vigência: ${formatDate(contract.startDate)} até ${formatDate(contract.endDate)}`}
                                        />
                                    </ListItem>
                                ))
                            )}
                        </List>
                        <Button fullWidth variant="outlined" sx={{ mt: 2 }} startIcon={<Assignment />}>
                            Gerenciar Todos os Contratos
                        </Button>
                    </Paper>
                </Grid>

                <Grid item xs={12} lg={4}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>Overview da Rede</Typography>
                        <Divider sx={{ mb: 2 }} />
                        {stats && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Distribuição por Tipo</Typography>
                                    <Box sx={{ mt: 1 }}>
                                        {Object.entries(stats.byType).map(([type, count]) => (
                                            <Box key={type} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                <Typography variant="caption">{type}</Typography>
                                                <Typography variant="caption" fontWeight="bold">{count}</Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                                <Divider />
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Status Global</Typography>
                                    <Box sx={{ mt: 1 }}>
                                        {Object.entries(stats.byStatus).map(([status, count]) => (
                                            <Box key={status} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                <Typography variant="caption">{status}</Typography>
                                                <Typography variant="caption" fontWeight="bold">{count}</Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            </Box>
                        )}
                    </Paper>

                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="subtitle1" gutterBottom fontWeight="bold">Suporte ao Parceiro</Typography>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                Precisa de ajuda com o portal ou deseja renegociar taxas?
                            </Typography>
                            <Button fullWidth variant="contained" color="primary">
                                Falar com Gerente de Contas
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default PartnerDashboard;
