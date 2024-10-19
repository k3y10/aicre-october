'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

const DataUpload: React.FC<{ onDataSync?: (data: any) => void }> = ({ onDataSync }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [uploadResults, setUploadResults] = useState<string | null>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Handle file upload and GPT-4 processing
  const handleFileUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setUploadStatus('Uploading and processing with GPT-4...');
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUploadResults(data.details); // Set the result from GPT-4
        setUploadStatus('File processed successfully.');

        // Trigger onDataSync if provided
        if (onDataSync) {
          onDataSync(data.details);
        }
      } else {
        const errorData = await response.json();
        setUploadStatus(`Error: ${errorData.error}`);
      }
    } catch (error) {
      setUploadStatus('File upload failed.');
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '20px', marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '15px', flex: 1 }}>
      <h2 style={{ fontSize: '16px', color: '#333', fontWeight: 600, marginBottom: '10px' }}>
        Upload SCRE Document for AI Processing
      </h2>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="file"
          onChange={handleFileChange}
          accept=".csv,.json,.txt"
          style={{ width: '100%', padding: '10px', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '14px' }}
        />
      </div>

      <button
        onClick={handleFileUpload}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#007bff', color: 'white', padding: '10px 16px', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', transition: 'background-color 0.3s ease' }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
      >
        <FontAwesomeIcon icon={faUpload} style={{ marginRight: '8px' }} />
        Upload File
      </button>

      {uploadStatus && <p style={{ color: '#666', fontSize: '14px' }}>{uploadStatus}</p>}

      {uploadResults && (
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '10px' }}>
            Processing Results
          </h3>
          <pre style={{ backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '6px', fontSize: '14px', overflowX: 'auto' }}>
            {uploadResults}
          </pre>
        </div>
      )}
    </div>
  );
};

export default DataUpload;
