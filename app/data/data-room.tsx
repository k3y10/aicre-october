'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from 'uuid';

type Property = {
  id: string;
  propertyName: string;
  city: string;
  type: string;
  address: string;
  noi: number;
  noiYTD: number;
  cashYTD: number;
  netCashFlowThisMonth: number;
  vacancy: number;
  value: number;
  leverage: number;
  yieldRate: number;
  dscr: number;
  opportunity: string;
  image: string | null;
  files: File[];
};

const DataRoom: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [newProperty, setNewProperty] = useState<Property>({
    id: uuidv4(),
    propertyName: '',
    city: '',
    type: '',
    address: '',
    noi: 0,
    noiYTD: 0,
    cashYTD: 0,
    netCashFlowThisMonth: 0,
    vacancy: 0,
    value: 0,
    leverage: 0,
    yieldRate: 0,
    dscr: 0,
    opportunity: '',
    image: null,
    files: [],
  });
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [uploadResults, setUploadResults] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setNewProperty((prevProperty) => ({
      ...prevProperty,
      files: acceptedFiles,
    }));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/*': ['.csv', '.xls', '.xlsx', '.pdf'] },
    multiple: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProperty((prevProperty) => ({
      ...prevProperty,
      [name]: name === 'vacancy' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProperties((prevProperties) => [...prevProperties, newProperty]);
    setNewProperty({
      id: uuidv4(),
      propertyName: '',
      city: '',
      type: '',
      address: '',
      noi: 0,
      noiYTD: 0,
      cashYTD: 0,
      netCashFlowThisMonth: 0,
      vacancy: 0,
      value: 0,
      leverage: 0,
      yieldRate: 0,
      dscr: 0,
      opportunity: '',
      image: null,
      files: [],
    });
  };

  const handleFileUpload = async () => {
    if (newProperty.files.length === 0) {
      setUploadStatus('Please select files to upload.');
      return;
    }

    const formData = new FormData();
    newProperty.files.forEach((file) => {
      formData.append('file', file);
    });

    try {
      setUploadStatus('Uploading and processing files...');
      const response = await fetch('/api/extract', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUploadResults(data.details);
        setUploadStatus('Files processed successfully.');
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
    <div className="property-form-upload">
      <form onSubmit={handleSubmit} className="property-form">
        <div className="form-grid">
          {/* Input fields for property details */}
          <div className="form-group">
            <label>Property Name</label>
            <input
              type="text"
              name="propertyName"
              value={newProperty.propertyName}
              onChange={handleInputChange}
              placeholder="e.g., Commercial Plaza"
              required
            />
          </div>
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={newProperty.city}
              onChange={handleInputChange}
              placeholder="e.g., New York"
              required
            />
          </div>
          <div className="form-group">
            <label>Type</label>
            <input
              type="text"
              name="type"
              value={newProperty.type}
              onChange={handleInputChange}
              placeholder="e.g., Office"
              required
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={newProperty.address}
              onChange={handleInputChange}
              placeholder="e.g., 123 Main St"
              required
            />
          </div>
        </div>

        {/* Dropzone for file upload */}
        <div className="form-group dropzone-wrapper">
          <label>Upload Documents (CSV, Excel, PDF)</label>
          <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
            <input {...getInputProps()} />
            {isDragActive ? <p>Drop the files here...</p> : <p>Drag & drop files here, or click to select files</p>}
          </div>
          {newProperty.files.length > 0 && (
            <ul className="file-list">
              {newProperty.files.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          )}
        </div>

        <button type="submit" className="submit-button">Add Property</button>
      </form>

      <button className="upload-button" onClick={handleFileUpload}>
        <FontAwesomeIcon icon={faUpload} style={{ marginRight: '8px' }} />
        Upload & Process Files
      </button>

      {uploadStatus && <p className="upload-status">{uploadStatus}</p>}
      {uploadResults && (
        <div className="upload-results">
          <h3>Processing Results</h3>
          <pre>{uploadResults}</pre>
        </div>
      )}

      <style jsx>{`
        .property-form-upload {
          background-color: #f0f2f5;
          padding: 30px;
          border-radius: 12px;
          margin: 20px auto;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        h2 {
          text-align: center;
          color: #333;
          margin-bottom: 20px;
        }
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }
        .form-group {
          margin-bottom: 15px;
        }
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 600;
          color: #555;
        }
        .form-group input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
        }
        .dropzone-wrapper {
          grid-column: span 2;
        }
        .dropzone {
          border: 2px dashed #aaa;
          border-radius: 8px;
          padding: 20px;
          background-color: #fafafa;
          text-align: center;
          transition: background-color 0.3s ease;
        }
        .dropzone.active {
          background-color: #e0f7fa;
        }
        .submit-button, .upload-button {
          background-color: #28a745;
          color: #fff;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          margin-top: 15px;
          font-size: 16px;
          display: block;
          width: 100%;
        }
        .submit-button:hover, .upload-button:hover {
          background-color: #218838;
        }
        .upload-status {
          margin-top: 10px;
          font-size: 14px;
          color: #555;
        }
        .upload-results {
          margin-top: 20px;
          background-color: #fff;
          padding: 15px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        pre {
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          font-size: 14px;
        }
        @media (max-width: 1024px) {
          .form-grid {
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          }
        }
        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
            gap: 15px;
          }
          .submit-button, .upload-button {
            font-size: 14px;
          }
        }
        @media (max-width: 480px) {
          .property-form-upload {
            padding: 20px;
          }
          .submit-button, .upload-button {
            padding: 8px 15px;
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
};

export default DataRoom;
