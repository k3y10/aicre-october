import React, { useEffect, useState } from 'react';

interface Property {
  id: string;
  propertyName: string;
  address: string;
  noiYTD: number;
  cashYTD: number;
  netCashFlowThisMonth: number;
  vacancy: number;
  value: number;
  leverage: number;
  yieldRate: number;
  dscr: number;
  opportunity: string;
  tenants: Tenant[];
}

interface Tenant {
  id: string;
  propertyName: string;
  termEnd?: string;
  notes?: string;
}

interface PropertyDetailsProps {
  selectedPropertyId: string;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ selectedPropertyId }) => {
  const [property, setProperty] = useState<Property | null>(null);

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        const response = await fetch(`/property_types/${selectedPropertyId}.json`);
        if (!response.ok) throw new Error(`Error ${response.status}: Property data not found`);
        const data = await response.json();
        setProperty(data);
      } catch (error) {
        console.error('Error loading property data:', error);
      }
    };

    fetchPropertyData();
  }, [selectedPropertyId]);

  if (!property) return <div>Loading property details...</div>;

  const renderNoteIcon = (note: string) => {
    if (note.toLowerCase().includes("traffic")) return <span className="note-icon traffic">⬆</span>;
    if (note.toLowerCase().includes("ar challenges")) return <span className="note-icon ar">⬇</span>;
    if (note.toLowerCase().includes("180 days notice")) return <span className="note-icon notice">★</span>;
    if (note.toLowerCase().includes("opportunity")) return <span className="note-icon opportunity">⭐</span>;
    return null;
  };

  return (
    <div className="property-detail-page">
      <div className="header">
        <div className="map-image">Map Image</div>
        <div className="property-info">
          <h2>{property.propertyName}</h2>
          <p>{property.address}</p>
        </div>
      </div>

      <h3>End of Last Month</h3>
      <div className="monthly-summary">
        <div>NOI YTD: ${property.noiYTD?.toLocaleString() || '0'}</div>
        <div>Cash YTD: ${property.cashYTD?.toLocaleString() || '0'}</div>
        <div>Net Cash Flow This Month: ${property.netCashFlowThisMonth?.toLocaleString() || '0'}</div>
        <div>Vacancy: {property.vacancy || 'N/A'}%</div>
      </div>

      <h3>Tenants</h3>
      <table className="tenants-table">
        <thead>
          <tr>
            <th>Tenant</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {property.tenants.map((tenant) => (
            <tr key={tenant.id}>
              <td>{tenant.propertyName}</td>
              <td>
                {renderNoteIcon(tenant.notes || '')} {tenant.notes || 'No notes available'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Operating Reports</h3>
      <div className="reports">
        <div className="report-icon">PDF - Oct 2024</div>
        <div className="report-icon">PDF - Q3 2024 Summary</div>
        <div className="report-icon">PDF - Sep 2024</div>
        <button className="upload-button">Upload Report</button>
      </div>

      <style jsx>{`
        .property-detail-page {
          padding: 20px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 20px;
        }

        .map-image {
          width: 150px;
          height: 150px;
          background-color: #e0e0e0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
        }

        .property-info h2 {
          font-size: 24px;
          margin: 0;
        }

        .property-info p {
          margin: 4px 0;
          color: #555;
        }

        h3 {
          font-size: 20px;
          margin-top: 20px;
          margin-bottom: 10px;
        }

        .monthly-summary {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          background-color: #f8f9fa;
          padding: 10px;
          border-radius: 8px;
          text-align: center;
          font-size: 14px;
          margin-bottom: 20px;
        }

        .tenants-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          background-color: #f8f9fa;
        }

        .tenants-table th,
        .tenants-table td {
          padding: 8px;
          border: 1px solid #ccc;
          text-align: left;
          font-size: 14px;
        }

        .note-icon {
          margin-right: 5px;
          font-size: 16px;
        }

        .note-icon.traffic {
          color: green;
        }

        .note-icon.ar {
          color: red;
        }

        .note-icon.notice,
        .note-icon.opportunity {
          color: gold;
        }

        .reports {
          display: flex;
          gap: 10px;
          align-items: center;
          margin-top: 20px;
        }

        .report-icon {
          background-color: #e0e0e0;
          padding: 10px;
          border-radius: 5px;
          text-align: center;
          font-size: 14px;
          cursor: pointer;
        }

        .upload-button {
          background-color: #007bff;
          color: white;
          padding: 10px 15px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
        }

        .upload-button:hover {
          background-color: #0056b3;
        }

        @media (max-width: 768px) {
          .property-detail-page {
            padding: 15px;
          }

          .monthly-summary {
            grid-template-columns: repeat(2, 1fr);
          }

          .header {
            flex-direction: column;
            align-items: flex-start;
          }

          .tenants-table th,
          .tenants-table td {
            font-size: 12px;
            padding: 6px;
          }
        }
      `}</style>
    </div>
  );
};

export default PropertyDetails;
