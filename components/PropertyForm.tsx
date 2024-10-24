import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';

type PropertyFormProps = {
  onAddNewAddress: (newAddress: Property) => void;
};

type Property = {
  id: string;
  propertyName: string;
  type: string;
  address: string;
  noi: number;
  value: number;
  leverage: number;
  yieldRate: number;
  dscr: number;
  opportunity: string;
  image: string | null;
  files: File[]; // Allow file uploads related to real estate (e.g., CSV, Excel)
};

const PropertyForm: React.FC<PropertyFormProps> = ({ onAddNewAddress }) => {
  const [newProperty, setNewProperty] = useState<Property>({
    id: uuidv4(),
    propertyName: '',
    type: '',
    address: '',
    noi: 0,
    value: 0,
    leverage: 0,
    yieldRate: 0,
    dscr: 0,
    opportunity: '',
    image: null, // File upload or drag-and-drop for an image
    files: [], // Drag-and-drop for real estate files
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setNewProperty((prevProperty) => ({
      ...prevProperty,
      files: acceptedFiles, // Append the uploaded files
    }));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.ms-excel': ['.xls', '.xlsx'],
      'text/csv': ['.csv'],
      'application/pdf': ['.pdf'],
    },
    multiple: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProperty((prevProperty) => ({
      ...prevProperty,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddNewAddress(newProperty);
    setNewProperty({
      id: uuidv4(),
      propertyName: '',
      type: '',
      address: '',
      noi: 0,
      value: 0,
      leverage: 0,
      yieldRate: 0,
      dscr: 0,
      opportunity: '',
      image: null,
      files: [],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="property-form">
      <div className="form-grid">
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
          <label>Type</label>
          <input
            type="text"
            name="type"
            value={newProperty.type}
            onChange={handleInputChange}
            placeholder="e.g., Retail"
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
            placeholder="e.g., 1234 Market St."
            required
          />
        </div>
        <div className="form-group">
          <label>NOI</label>
          <input
            type="number"
            name="noi"
            value={newProperty.noi}
            onChange={handleInputChange}
            placeholder="e.g., 100000"
          />
        </div>
        <div className="form-group">
          <label>Value</label>
          <input
            type="number"
            name="value"
            value={newProperty.value}
            onChange={handleInputChange}
            placeholder="e.g., 1000000"
          />
        </div>
        <div className="form-group">
          <label>Leverage</label>
          <input
            type="number"
            name="leverage"
            value={newProperty.leverage}
            onChange={handleInputChange}
            placeholder="e.g., 75"
          />
        </div>
        <div className="form-group">
          <label>Yield Rate (%)</label>
          <input
            type="number"
            name="yieldRate"
            value={newProperty.yieldRate}
            onChange={handleInputChange}
            placeholder="e.g., 5"
          />
        </div>
        <div className="form-group">
          <label>DSCR</label>
          <input
            type="number"
            name="dscr"
            value={newProperty.dscr}
            onChange={handleInputChange}
            placeholder="e.g., 1.5"
          />
        </div>
        <div className="form-group">
          <label>Opportunity</label>
          <input
            type="text"
            name="opportunity"
            value={newProperty.opportunity}
            onChange={handleInputChange}
            placeholder="e.g., High Growth"
          />
        </div>

        {/* File Upload for Real Estate Documents */}
        <div className="form-group">
          <label>Upload Documents (CSV, Excel, PDF)</label>
          <div
            {...getRootProps()}
            className={`dropzone ${isDragActive ? 'active' : ''}`}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here...</p>
            ) : (
              <p>Drag & drop files here, or click to select files</p>
            )}
          </div>
          {newProperty.files.length > 0 && (
            <ul className="file-list">
              {newProperty.files.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <button type="submit" className="submit-button">Add Property</button>

      <style jsx>{`
        .property-form {
          background-color: #fff;
          padding: 20px;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 100%;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          width: 100%;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
        }

        .form-group input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }

        .dropzone {
          padding: 20px;
          border: 2px dashed #ccc;
          border-radius: 5px;
          background-color: #f9f9f9;
          cursor: pointer;
          text-align: center;
          transition: background-color 0.3s ease;
        }

        .dropzone.active {
          background-color: #e9e9e9;
        }

        .file-list {
          margin-top: 10px;
        }

        .file-list li {
          font-size: 14px;
          margin-bottom: 5px;
        }

        .submit-button {
          background-color: #64E2E2;
          color: white;
          padding: 10px 15px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 20px;
        }

        .submit-button:hover {
          background-color: #5FD2D2;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </form>
  );
};

export default PropertyForm;
