import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Person,
  AttachFile,
  Flag,
  MoreVert,
} from '@mui/icons-material';
import { claimService } from '../../services/claim.service';

interface InvestigationNote {
  id: string;
  claimId: string;
  content: string;
  category: 'general' | 'evidence' | 'witness' | 'expert' | 'legal' | 'financial';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdBy: {
    id: string;
    name: string;
    role: string;
    avatarUrl?: string;
  };
  createdAt: string;
  updatedAt?: string;
  attachments?: {
    id: string;
    fileName: string;
    fileUrl: string;
  }[];
  isPrivate: boolean;
  tags?: string[];
}

interface ClaimInvestigationNotesProps {
  claimId: string;
}

export const ClaimInvestigationNotes: React.FC<ClaimInvestigationNotesProps> = ({ claimId }) => {
  const [notes, setNotes] = useState<InvestigationNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<InvestigationNote | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const [formData, setFormData] = useState({
    content: '',
    category: 'general' as InvestigationNote['category'],
    priority: 'medium' as InvestigationNote['priority'],
    isPrivate: false,
    tags: '',
  });

  useEffect(() => {
    loadNotes();
  }, [claimId]);

  const loadNotes = async () => {
    try {
      const response = await claimService.getInvestigationNotes(claimId);
      setNotes(response.data);
    } catch (error) {
      console.error('Failed to load investigation notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (note?: InvestigationNote) => {
    if (note) {
      setEditingNote(note);
      setFormData({
        content: note.content,
        category: note.category,
        priority: note.priority,
        isPrivate: note.isPrivate,
        tags: note.tags?.join(', ') || '',
      });
    } else {
      setEditingNote(null);
      setFormData({
        content: '',
        category: 'general',
        priority: 'medium',
        isPrivate: false,
        tags: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingNote(null);
  };

  const handleSubmit = async () => {
    try {
      const noteData = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        claimId,
      };

      if (editingNote) {
        await claimService.updateInvestigationNote(editingNote.id, noteData);
      } else {
        await claimService.createInvestigationNote(noteData);
      }

      loadNotes();
      handleCloseDialog();
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  };

  const handleDelete = async (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await claimService.deleteInvestigationNote(noteId);
        loadNotes();
      } catch (error) {
        console.error('Failed to delete note:', error);
      }
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      general: 'default',
      evidence: 'primary',
      witness: 'secondary',
      expert: 'info',
      legal: 'warning',
      financial: 'success',
    };
    return colors[category] || 'default';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, 'default' | 'error' | 'warning' | 'info'> = {
      low: 'info',
      medium: 'default',
      high: 'warning',
      critical: 'error',
    };
    return colors[priority] || 'default';
  };

  const filteredNotes = notes.filter(note => {
    if (filterCategory !== 'all' && note.category !== filterCategory) return false;
    if (filterPriority !== 'all' && note.priority !== filterPriority) return false;
    return true;
  });

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Investigation Notes</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Note
        </Button>
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={filterCategory}
            label="Category"
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <MenuItem value="all">All Categories</MenuItem>
            <MenuItem value="general">General</MenuItem>
            <MenuItem value="evidence">Evidence</MenuItem>
            <MenuItem value="witness">Witness</MenuItem>
            <MenuItem value="expert">Expert</MenuItem>
            <MenuItem value="legal">Legal</MenuItem>
            <MenuItem value="financial">Financial</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={filterPriority}
            label="Priority"
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <MenuItem value="all">All Priorities</MenuItem>
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="critical">Critical</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Notes List */}
      {loading ? (
        <Typography>Loading notes...</Typography>
      ) : filteredNotes.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="textSecondary">
            No investigation notes found. Add your first note to get started.
          </Typography>
        </Box>
      ) : (
        <List>
          {filteredNotes.map((note, index) => (
            <React.Fragment key={note.id}>
              {index > 0 && <Divider />}
              <ListItem
                alignItems="flex-start"
                sx={{
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
                secondaryAction={
                  <Box>
                    <IconButton onClick={() => handleOpenDialog(note)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(note.id)}>
                      <Delete />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemAvatar>
                  <Avatar src={note.createdBy.avatarUrl}>
                    {note.createdBy.name.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {note.createdBy.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {note.createdBy.role}
                      </Typography>
                      <Chip
                        label={note.category}
                        size="small"
                        color={getCategoryColor(note.category) as any}
                      />
                      <Chip
                        icon={<Flag />}
                        label={note.priority}
                        size="small"
                        color={getPriorityColor(note.priority)}
                      />
                      {note.isPrivate && (
                        <Chip label="Private" size="small" variant="outlined" />
                      )}
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography
                        variant="body2"
                        color="text.primary"
                        sx={{ mb: 1, whiteSpace: 'pre-wrap' }}
                      >
                        {note.content}
                      </Typography>
                      
                      {note.tags && note.tags.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
                          {note.tags.map((tag, idx) => (
                            <Chip key={idx} label={tag} size="small" variant="outlined" />
                          ))}
                        </Box>
                      )}

                      {note.attachments && note.attachments.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                          {note.attachments.map((attachment) => (
                            <Chip
                              key={attachment.id}
                              icon={<AttachFile />}
                              label={attachment.fileName}
                              size="small"
                              clickable
                              component="a"
                              href={attachment.fileUrl}
                              target="_blank"
                            />
                          ))}
                        </Box>
                      )}

                      <Typography variant="caption" color="textSecondary">
                        {new Date(note.createdAt).toLocaleString()}
                        {note.updatedAt && note.updatedAt !== note.createdAt && (
                          <> (edited {new Date(note.updatedAt).toLocaleString()})</>
                        )}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingNote ? 'Edit Investigation Note' : 'Add Investigation Note'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              multiline
              rows={6}
              label="Note Content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                >
                  <MenuItem value="general">General</MenuItem>
                  <MenuItem value="evidence">Evidence</MenuItem>
                  <MenuItem value="witness">Witness Statement</MenuItem>
                  <MenuItem value="expert">Expert Opinion</MenuItem>
                  <MenuItem value="legal">Legal</MenuItem>
                  <MenuItem value="financial">Financial</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  label="Priority"
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <TextField
              fullWidth
              label="Tags (comma-separated)"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="fraud, investigation, urgent"
            />

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                id="isPrivate"
                checked={formData.isPrivate}
                onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
              />
              <label htmlFor="isPrivate" style={{ marginLeft: 8 }}>
                Mark as private (visible only to investigators)
              </label>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!formData.content.trim()}>
            {editingNote ? 'Update' : 'Add'} Note
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ClaimInvestigationNotes;
