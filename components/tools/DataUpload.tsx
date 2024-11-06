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
      const response = await fetch('/api/extract', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUploadResults(data.details); // Set the result from data extraction
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
    <div className="data-upload-container">
      <h2>Upload SCRE Document for AI Processing</h2>

      <input
        type="file"
        onChange={handleFileChange}
        accept=".csv,.json,.txt"
        className="file-input"
      />

      <button className="upload-button" onClick={handleFileUpload}>
        <FontAwesomeIcon icon={faUpload} style={{ marginRight: '8px' }} />
        Upload File
      </button>

      {uploadStatus && <p className="upload-status">{uploadStatus}</p>}

      {uploadResults && (
        <div className="upload-results">
          <h3>Processing Results</h3>
          <pre>{uploadResults}</pre>
        </div>
      )}

      <style jsx>{`
        .data-upload-container {
          padding: 20px;
          background-color: #f8f9fa;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          margin-top: 15px;
        }

        .file-input {
          width: 100%;
          padding: 10px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
        }

        .upload-button {
          margin-top: 15px;
          padding: 10px 16px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .upload-button:hover {
          background-color: #0056b3;
        }

        .upload-status {
          margin-top: 10px;
          font-size: 14px;
          color: #666;
        }

        .upload-results {
          margin-top: 20px;
          background-color: #fff;
          padding: 15px;
          border-radius: 8px;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
        }

        pre {
          background-color: #f9f9f9;
          padding: 10px;
          border-radius: 6px;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default DataUpload;
