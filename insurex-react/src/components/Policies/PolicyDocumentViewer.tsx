import React from 'react';
import {
    Box,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Button,
    Divider,
    Tooltip
} from '@mui/material';
import {
    Description,
    Download,
    Visibility,
    Delete,
    CloudUpload
} from '@mui/icons-material';
import { Policy, PolicyDocument } from '../../types/policy.types';
import { format } from 'date-fns';

interface PolicyDocumentViewerProps {
    policy: Policy;
    onUpload?: () => void;
    onDelete?: (documentId: string) => void;
    onView?: (document: PolicyDocument) => void;
}

export const PolicyDocumentViewer: React.FC<PolicyDocumentViewerProps> = ({
    policy,
    onUpload,
    onDelete,
    onView
}) => {
    const documents = policy.documents || [];

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Documentos da Apólice</Typography>
                <Button
                    variant="outlined"
                    startIcon={<CloudUpload />}
                    onClick={onUpload}
                >
                    Upload
                </Button>
            </Box>

            {documents.length === 0 ? (
                <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', bgcolor: 'background.default' }}>
                    <Description sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                    <Typography color="text.secondary">
                        Nenhum documento anexado a esta apólice.
                    </Typography>
                </Paper>
            ) : (
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    {documents.map((doc, index) => (
                        <React.Fragment key={doc.id}>
                            <ListItem alignItems="flex-start">
                                <ListItemIcon>
                                    <Description color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={doc.name}
                                    secondary={
                                        <>
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                {doc.type}
                                            </Typography>
                                            {` — Adicionado em ${format(new Date(doc.uploadedAt), 'dd/MM/yyyy')}`}
                                        </>
                                    }
                                />
                                <ListItemSecondaryAction>
                                    <Tooltip title="Visualizar">
                                        <IconButton edge="end" aria-label="view" onClick={() => onView?.(doc)}>
                                            <Visibility />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Download">
                                        <IconButton
                                            edge="end"
                                            aria-label="download"
                                            component="a"
                                            href={doc.url}
                                            download
                                            target="_blank"
                                        >
                                            <Download />
                                        </IconButton>
                                    </Tooltip>
                                    {onDelete && (
                                        <Tooltip title="Excluir">
                                            <IconButton edge="end" aria-label="delete" onClick={() => onDelete(doc.id)}>
                                                <Delete />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </ListItemSecondaryAction>
                            </ListItem>
                            {index < documents.length - 1 && <Divider variant="inset" component="li" />}
                        </React.Fragment>
                    ))}
                </List>
            )}
        </Box>
    );
};

export default PolicyDocumentViewer;
