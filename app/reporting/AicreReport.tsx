import React, { useEffect, useState, useRef } from 'react';
import { analyzeProperties } from '@//utilities/aiReport';
import jsPDF from 'jspdf';

const AicreReport: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [insights, setInsights] = useState<string | null>(null);
  const [propertyType, setPropertyType] = useState<string>('commercial');
  const pdfUrl = useRef<string | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      try {
        const generatedInsights = await analyzeProperties(propertyType);
        setInsights(generatedInsights);

        if (generatedInsights) {
          generatePDF(generatedInsights);
        }
      } catch (error) {
        console.error('Error fetching property insights:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [propertyType]);

  // Function to generate the PDF using jsPDF
  const generatePDF = (insights: string) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Property Report', 20, 20);
    doc.setFontSize(12);
    doc.text(insights, 20, 40, { maxWidth: 170 });

    // Convert the PDF to a Blob URL and store it in the ref
    const pdfBlob = doc.output('blob');
    pdfUrl.current = URL.createObjectURL(pdfBlob);
  };

  return (
    <div className="aicre-report-page">
      <h1>Property Report</h1>

      {/* Property Type Selector */}
      <select
        value={propertyType}
        onChange={(e) => setPropertyType(e.target.value)}
        className="property-type-selector"
      >
        <option value="commercial">Commercial</option>
        <option value="residential">Residential</option>
        {/* Add other property types as needed */}
      </select>

      {/* Loading Indicator */}
      {loading && <div className="loading">Loading report...</div>}

      {/* Generated Insights */}
      {!loading && insights && pdfUrl.current ? (
        <>
          <div className="report-container">
            <h2>Generated Insights</h2>
            <p>{insights}</p>
          </div>

          {/* PDF Iframe */}
          <div className="pdf-container">
            <iframe
              src={pdfUrl.current}
              width="100%"
              height="600px"
              title="Property Report PDF"
              onLoad={() => setLoading(false)}
            />
          </div>

          {/* Download Button */}
          <button
            onClick={() => {
              if (pdfUrl.current) {
                const a = document.createElement('a');
                a.href = pdfUrl.current;
                a.download = 'Property_Report.pdf';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }
            }}
            className="download-btn"
          >
            Download Report
          </button>
        </>
      ) : (
        !loading && <div className="no-data">No report available.</div>
      )}

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

        .property-type-selector {
          padding: 10px;
          margin-bottom: 20px;
          border-radius: 4px;
          border: 1px solid #ddd;
        }

        .loading {
          font-size: 18px;
          color: #007bff;
          margin-bottom: 20px;
        }

        .report-container {
          margin-top: 20px;
          background-color: #f8f8f8;
          padding: 20px;
          border-radius: 8px;
          text-align: left;
        }

        .pdf-container {
          margin: 30px 0;
          border: 1px solid #ddd;
          border-radius: 4px;
          overflow: hidden;
        }

        .no-data {
          margin-top: 20px;
          font-size: 16px;
          color: #888;
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
