import React, { useState } from 'react';

const SREOPage: React.FC = () => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Predefined PDF options for user selection
  const pdfOptions = [
    { label: 'Appraisal Form 1007 (Rent Comp)', path: '/appraisal-form-1007.pdf' },
    { label: 'Appraisal Form 1004 (SFR)', path: '/appraisal-form-1004.pdf' },
    { label: 'CRE Schedule Real Estate', path: '/cre-schedule-real-estate.pdf.pdf' },
    { label: 'Schedule Real Estate Owned', path: '/aicre/public/appraisal-form-1007.pdf' }
  ];

  // Handle user selection of a predefined PDF
  const handlePdfSelect = (path: string) => {
    setPdfUrl(path);
    setUploadedFile(null); // Clear uploaded file selection
  };

  // Handle file upload for custom PDF viewing
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      setUploadedFile(file);
    }
  };

  return (
    <div className="sreo-page">
      <h1>Schedule of Real Estate Owned (SREO)</h1>

      {/* Predefined PDF Selection */}
      <div className="pdf-selector">
        <label>Select a PDF Document: </label>
        <select onChange={(e) => handlePdfSelect(e.target.value)}>
          <option value="">-- Choose a Document --</option>
          {pdfOptions.map((option, index) => (
            <option key={index} value={option.path}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Upload Custom PDF */}
      <div className="pdf-upload">
        <label className="upload-label">
          Or Upload a Custom PDF
          <input type="file" accept="application/pdf" onChange={handleFileUpload} />
        </label>
      </div>

      {/* PDF Display in Iframe */}
      {pdfUrl && (
        <div className="pdf-container">
          <iframe src={pdfUrl} width="100%" height="600px" title="PDF Viewer" />
        </div>
      )}

      {/* Download Button */}
      {pdfUrl && (
        <button
          onClick={() => {
            const a = document.createElement('a');
            a.href = pdfUrl;
            a.download = uploadedFile ? uploadedFile.name : 'Selected_Document.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }}
          className="download-btn"
        >
          Download PDF
        </button>
      )}

      <style jsx>{`
        .sreo-page {
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          text-align: center;
          max-width: 800px;
          margin: auto;
        }

        .pdf-selector,
        .pdf-upload {
          margin: 20px 0;
        }

        .upload-label {
          display: inline-block;
          padding: 10px;
          color: white;
          background-color: #007bff;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 10px;
        }

        .upload-label input {
          display: none;
        }

        .pdf-container {
          margin: 30px 0;
        }

        .download-btn {
          margin-top: 20px;
          padding: 10px 20px;
          color: white;
          background-color: #007bff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default SREOPage;
