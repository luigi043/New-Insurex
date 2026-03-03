import React, { useState, useEffect, useCallback } from 'react';

import {

  Box,

  Typography,

  Paper,

  TextField,

  Button,

  Chip,

  Divider,

  List,

  ListItem,

  Avatar,

  IconButton,

  FormControl,

  InputLabel,

  Select,

  MenuItem,

  FormControlLabel,

  Switch,

  CircularProgress,

  Alert,

  Tooltip,

  Collapse,

} from '@mui/material';

import {

  Send,

  Delete,

  ExpandMore,

  ExpandLess,

  Search,

  NoteAdd,

  Visibility,

  VisibilityOff,

  FilterList,

} from '@mui/icons-material';

import apiClient from '../../services/api.service';

import { useNotification } from '../../hooks/useNotification';

import { formatRelativeTime } from '../../utils/formatters';

 

export interface InvestigationNote {

  id: string;

  content: string;

  category: NoteCategory;

  isInternal: boolean;

  author: {

    id: string;

    name: string;

    avatar?: string;

  };

  createdAt: string;

  updatedAt?: string;

  attachments?: { name: string; url: string }[];

}

 

export type NoteCategory = 'investigation' | 'assessment' | 'communication' | 'evidence' | 'decision';

 

const categoryLabels: Record<NoteCategory, string> = {

  investigation: 'Investigation',

  assessment: 'Assessment',

  communication: 'Communication',

  evidence: 'Evidence',

  decision: 'Decision',

};

 

const categoryColors: Record<NoteCategory, 'primary' | 'secondary' | 'info' | 'warning' | 'success'> = {

  investigation: 'primary',

  assessment: 'warning',

  communication: 'info',

  evidence: 'secondary',

  decision: 'success',

};

 

interface InvestigationNotesProps {

  claimId: string;

}

 

export const InvestigationNotes: React.FC<InvestigationNotesProps> = ({ claimId }) => {

  const { showSuccess, showError } = useNotification();

  const [notes, setNotes] = useState<InvestigationNote[]>([]);

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [expanded, setExpanded] = useState(true);

 

  // Form state

  const [content, setContent] = useState('');

  const [category, setCategory] = useState<NoteCategory>('investigation');

  const [isInternal, setIsInternal] = useState(true);

 

  // Filter state

  const [filterCategory, setFilterCategory] = useState<NoteCategory | 'all'>('all');

  const [showFilters, setShowFilters] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

 

  const fetchNotes = useCallback(async () => {

    try {

      const response = await apiClient.get(`/claims/${claimId}/notes`);

      setNotes(response.data || []);

    } catch {

      // Silently handle - notes may not exist yet

      setNotes([]);

    } finally {

      setLoading(false);

    }

  }, [claimId]);

 

  useEffect(() => {

    fetchNotes();

  }, [fetchNotes]);

 

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!content.trim()) return;

 

    setSubmitting(true);

    try {

      const response = await apiClient.post(`/claims/${claimId}/notes`, {

        content: content.trim(),

        category,

        isInternal,

      });

      setNotes((prev) => [response.data, ...prev]);

      setContent('');

      showSuccess('Investigation note added successfully');

    } catch (err: any) {

      showError(err.response?.data?.message || 'Failed to add note');

    } finally {

      setSubmitting(false);

    }

  };

 

  const handleDelete = async (noteId: string) => {

    try {

      await apiClient.delete(`/claims/${claimId}/notes/${noteId}`);

      setNotes((prev) => prev.filter((n) => n.id !== noteId));

      showSuccess('Note deleted');

    } catch {

      showError('Failed to delete note');

    }

  };

 

  const filteredNotes = notes.filter((note) => {

    if (filterCategory !== 'all' && note.category !== filterCategory) return false;

    if (searchQuery && !note.content.toLowerCase().includes(searchQuery.toLowerCase())) return false;

    return true;

  });

 

  return (

    <Paper sx={{ p: 3 }}>

      <Box

        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}

        onClick={() => setExpanded(!expanded)}

        role="button"

        aria-expanded={expanded}

        aria-label="Toggle investigation notes"

        tabIndex={0}

        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setExpanded(!expanded); }}

      >

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>

          <NoteAdd color="primary" />

          <Typography variant="h6">Investigation Notes</Typography>

          <Chip label={notes.length} size="small" />

        </Box>

        {expanded ? <ExpandLess /> : <ExpandMore />}

      </Box>

 

      <Collapse in={expanded}>

        <Divider sx={{ my: 2 }} />

 

        {/* Add Note Form */}

        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>

          <TextField

            fullWidth

            multiline

            rows={3}

            placeholder="Add investigation note..."

            value={content}

            onChange={(e) => setContent(e.target.value)}

            sx={{ mb: 2 }}

            aria-label="Investigation note content"

          />

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>

            <FormControl size="small" sx={{ minWidth: 160 }}>

              <InputLabel id="note-category-label">Category</InputLabel>

              <Select

                labelId="note-category-label"

                value={category}

                label="Category"

                onChange={(e) => setCategory(e.target.value as NoteCategory)}

              >

                {Object.entries(categoryLabels).map(([value, label]) => (

                  <MenuItem key={value} value={value}>{label}</MenuItem>

                ))}

              </Select>

            </FormControl>

            <FormControlLabel

              control={

                <Switch

                  checked={isInternal}

                  onChange={(e) => setIsInternal(e.target.checked)}

                  size="small"

                />

              }

              label={

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>

                  {isInternal ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}

                  <Typography variant="body2">{isInternal ? 'Internal' : 'External'}</Typography>

                </Box>

              }

            />

            <Box sx={{ ml: 'auto' }}>

              <Button

                type="submit"

                variant="contained"

                startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <Send />}

                disabled={submitting || !content.trim()}

              >

                {submitting ? 'Adding...' : 'Add Note'}

              </Button>

            </Box>

          </Box>

        </Box>

 

        {/* Filters */}

        <Box sx={{ mb: 2 }}>

          <Button

            size="small"

            startIcon={<FilterList />}

            onClick={() => setShowFilters(!showFilters)}

            aria-label="Toggle note filters"

          >

            Filters

          </Button>

          <Collapse in={showFilters}>

            <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>

              <TextField

                size="small"

                placeholder="Search notes..."

                value={searchQuery}

                onChange={(e) => setSearchQuery(e.target.value)}

                InputProps={{ startAdornment: <Search fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} /> }}

                aria-label="Search investigation notes"

              />

              <FormControl size="small" sx={{ minWidth: 140 }}>

                <InputLabel id="filter-category-label">Category</InputLabel>

                <Select

                  labelId="filter-category-label"

                  value={filterCategory}

                  label="Category"

                  onChange={(e) => setFilterCategory(e.target.value as NoteCategory | 'all')}

                >

                  <MenuItem value="all">All Categories</MenuItem>

                  {Object.entries(categoryLabels).map(([value, label]) => (

                    <MenuItem key={value} value={value}>{label}</MenuItem>

                  ))}

                </Select>

              </FormControl>

            </Box>

          </Collapse>

        </Box>

 

        {/* Notes List */}

        {loading ? (

          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>

            <CircularProgress size={32} />

          </Box>

        ) : filteredNotes.length === 0 ? (

          <Alert severity="info" sx={{ mt: 1 }}>

            {notes.length === 0

              ? 'No investigation notes yet. Add the first note above.'

              : 'No notes match the current filters.'}

          </Alert>

        ) : (

          <List disablePadding>

            {filteredNotes.map((note, index) => (

              <React.Fragment key={note.id}>

                {index > 0 && <Divider />}

                <ListItem

                  alignItems="flex-start"

                  sx={{

                    px: 0,

                    py: 2,

                    bgcolor: note.isInternal ? 'rgba(255, 243, 224, 0.3)' : 'transparent',

                    borderRadius: 1,

                  }}

                  secondaryAction={

                    <Tooltip title="Delete note">

                      <IconButton

                        edge="end"

                        size="small"

                        onClick={() => handleDelete(note.id)}

                        aria-label={`Delete note by ${note.author?.name || 'Unknown'}`}

                      >

                        <Delete fontSize="small" />

                      </IconButton>

                    </Tooltip>

                  }
                  >

                  <Box sx={{ display: 'flex', gap: 2, width: '100%', pr: 4 }}>

                    <Avatar sx={{ width: 36, height: 36, fontSize: 14 }}>

                      {note.author?.name?.charAt(0) || 'U'}

                    </Avatar>

                    <Box sx={{ flexGrow: 1 }}>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>

                        <Typography variant="subtitle2">

                          {note.author?.name || 'Unknown'}

                        </Typography>

                        <Chip

                          label={categoryLabels[note.category] || note.category}

                          size="small"

                          color={categoryColors[note.category] || 'default'}

                          variant="outlined"

                        />

                        {note.isInternal && (

                          <Chip

                            icon={<VisibilityOff fontSize="small" />}

                            label="Internal"

                            size="small"

                            variant="outlined"

                            color="warning"

                          />

                        )}

                        <Typography variant="caption" color="text.secondary">

                          {formatRelativeTime(note.createdAt)}

                        </Typography>

                      </Box>

                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>

                        {note.content}

                      </Typography>

                    </Box>

                  </Box>

                </ListItem>

              </React.Fragment>

            ))}

          </List>

        )}

      </Collapse>

    </Paper>

  );

};

 

export default InvestigationNotes;