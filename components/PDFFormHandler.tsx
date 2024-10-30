import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';

const PDFFormHandler: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Helper to fetch and load PDF template as ArrayBuffer
  const fetchPDFTemplate = async (templatePath: string): Promise<ArrayBuffer> => {
    const response = await fetch(templatePath);
    return await response.arrayBuffer();
  };

  // Fill the PDF template with example data and return filled PDF bytes
  const fillPDF = async (pdfTemplate: ArrayBuffer) => {
    const pdfDoc = await PDFDocument.load(pdfTemplate, { ignoreEncryption: true });
    const form = pdfDoc.getForm();

    // Example fields filled - replace with actual field names in your templates
    form.getTextField('FieldName1').setText('Sample Value 1');
    form.getTextField('FieldName2').setText('Sample Value 2');
    form.getTextField('FieldName3').setText('Sample Value 3');

    form.flatten();
    return await pdfDoc.save();
  };

  // Handle downloading the filled PDF
  const generatePDF = async () => {
    setLoading(true);
    const pdfTemplate = await fetchPDFTemplate('/path/to/Standardized_Appraisal_Form_1004_SFR.pdf'); // Replace path
    const filledPdfBytes = await fillPDF(pdfTemplate);

    const blob = new Blob([filledPdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Filled_Form.pdf';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    setLoading(false);
  };

  // Handle file upload for processing (future implementation could extract data or display file)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadedFile(file || null);
    console.log("Uploaded file:", file); // Process file as needed
  };

  return (
    <div className="pdf-form-handler">
      <h2>PDF Form Management</h2>

      {/* Generate Filled PDF Button */}
      <button onClick={generatePDF} className="generate-pdf-btn" disabled={loading}>
        {loading ? 'Generating PDF...' : 'Download Filled PDF'}
      </button>

      {/* Upload PDF Form Button */}
      <label className="upload-label">
        Upload Completed Form
        <input type="file" accept="application/pdf" onChange={handleFileUpload} />
      </label>

      {uploadedFile && <p>Uploaded File: {uploadedFile.name}</p>}

      <style jsx>{`
        .pdf-form-handler {
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 30px;
          text-align: center;
        }

        .generate-pdf-btn,
        .upload-label {
          display: inline-block;
          margin: 10px 0;
          padding: 10px 15px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s;
          text-align: center;
        }

        .generate-pdf-btn:disabled {
          background-color: #bbb;
          cursor: not-allowed;
        }

        .upload-label {
          cursor: pointer;
        }

        .upload-label input {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default PDFFormHandler;
