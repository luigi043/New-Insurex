import React, { useState } from 'react';
import axios from 'axios';

interface DocumentUploadProps {
  claimId: string;
  onUpload: () => void;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const DocumentUpload: React.FC<DocumentUploadProps> = ({ claimId, onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState('Other');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/claims/${claimId}/documents`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setFile(null);
      onUpload();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border rounded-lg p-4">
      <h4 className="font-medium mb-3">Upload Document</h4>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            title="Document Category"
          >
            <option value="PoliceReport">Police Report</option>
            <option value="MedicalReport">Medical Report</option>
            <option value="RepairEstimate">Repair Estimate</option>
            <option value="PhotoEvidence">Photo Evidence</option>
            <option value="Receipt">Receipt</option>
            <option value="LegalDocument">Legal Document</option>
            <option value="Correspondence">Correspondence</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">File</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mt-1 block w-full"
            required
            title="Select file to upload"
          />
        </div>

        <button
          type="submit"
          disabled={!file || uploading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
};