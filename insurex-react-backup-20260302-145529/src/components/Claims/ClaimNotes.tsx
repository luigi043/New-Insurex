import React, { useState } from 'react';
import axios from 'axios';

interface ClaimNotesProps {
  claimId: string;
  notes: any[];
  onAdd: () => void;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const ClaimNotes: React.FC<ClaimNotesProps> = ({ claimId, notes, onAdd }) => {
  const [content, setContent] = useState('');
  const [isInternal, setIsInternal] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/claims/${claimId}/notes`, {
        content,
        isInternal
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContent('');
      onAdd();
    } catch (error) {
      console.error('Failed to add note:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border rounded-lg p-4">
      <h4 className="font-medium mb-3">Notes</h4>
      
      <form onSubmit={handleSubmit} className="space-y-3 mb-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a note..."
          className="w-full rounded-md border-gray-300 shadow-sm"
          rows={3}
          required
          title="Note content"
        />
        
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isInternal}
              onChange={(e) => setIsInternal(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm">Internal note</span>
          </label>
          
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? 'Adding...' : 'Add Note'}
          </button>
        </div>
      </form>

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {notes?.map((note: any) => (
          <div key={note.id} className={`p-3 rounded ${note.isInternal ? 'bg-yellow-50' : 'bg-gray-50'}`}>
            <p className="text-sm">{note.content}</p>
            <div className="text-xs text-gray-500 mt-1">
              By {note.author} on {new Date(note.createdAt).toLocaleDateString()}
              {note.isInternal && <span className="ml-2 text-yellow-600">(Internal)</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};