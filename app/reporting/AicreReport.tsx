import React, { useState } from 'react';

const AicreReport: React.FC = () => {
  // PDF URL for the example property report
  const pdfUrl = 'https://assets.tophap.com/cms/TopHap-Full-Property-Report-Sample-1-1.pdf';
  const [loading, setLoading] = useState<boolean>(true);

  // Handle iframe loading state
  const handleIframeLoad = () => {
    setLoading(false);
  };

  return (
    <div className="aicre-report-page">
      <h1>Property Report</h1>
      
      {/* Loading Indicator */}
      {loading && <div className="loading">Loading report...</div>}
      
      {/* PDF Iframe */}
      <div className="pdf-container">
        <iframe
          src={pdfUrl}
          width="100%"
          height="600px"
          title="Property Report"
          onLoad={handleIframeLoad}
        />
      </div>

      {/* Download Button */}
      <button
        onClick={() => {
          const a = document.createElement('a');
          a.href = pdfUrl;
          a.download = 'Property_Report.pdf';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }}
        className="download-btn"
      >
        Download Report
      </button>

      <style jsx>{`
        .aicre-report-page {
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          max-width: 800px;
          margin: auto;
          text-align: center;
        }

        h1 {
          margin-bottom: 20px;
        }

        .pdf-container {
          margin: 30px 0;
          border: 1px solid #ddd;
          border-radius: 4px;
          overflow: hidden;
        }

        .loading {
          font-size: 18px;
          color: #007bff;
          margin-bottom: 20px;
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
          transition: background-color 0.3s;
        }

        .download-btn:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default AicreReport;
