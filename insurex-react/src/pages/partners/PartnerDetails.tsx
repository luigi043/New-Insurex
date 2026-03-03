import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Breadcrumbs, Link, Typography, Paper } from '@mui/material';
import { ArrowBack, Edit } from '@mui/icons-material';
import { PartnerDashboard } from '../../components/Partners/PartnerDashboard';

export const PartnerDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    if (!id) return null;

    return (
        <Box>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Breadcrumbs sx={{ mb: 1 }}>
                        <Link
                            component="button"
                            variant="body2"
                            onClick={() => navigate('/partners')}
                            underline="hover"
                            color="inherit"
                        >
                            Parceiros
                        </Link>
                        <Typography variant="body2" color="text.primary">Detalhes</Typography>
                    </Breadcrumbs>
                    <Button
                        startIcon={<ArrowBack />}
                        onClick={() => navigate('/partners')}
                        sx={{ mb: 1 }}
                    >
                        Voltar para Lista
                    </Button>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={() => navigate(`/partners/edit/${id}`)}
                >
                    Editar Parceiro
                </Button>
            </Box>

            <Paper sx={{ p: 0, overflow: 'hidden' }}>
                <Box sx={{ p: 3 }}>
                    <PartnerDashboard partnerId={id} />
                </Box>
            </Paper>
        </Box>
    );
};

export default PartnerDetails;
