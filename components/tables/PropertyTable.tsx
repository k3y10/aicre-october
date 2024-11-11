import React, { useEffect, useState } from 'react';

interface Property {
  id: string;
  propertyName: string;
  city: string;
  noiYTD: number;
  cashYTD: number;
  netCashFlowThisMonth: number;
  vacancy: number;
}

interface PropertyTableProps {
  onPropertyClick: (propertyId: string) => void;
}

const PropertyTable: React.FC<PropertyTableProps> = ({ onPropertyClick }) => {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const propertyFiles = [
          { id: 'brickyardplaza', path: '/property_types/brickyardplaza.json' },
          { id: 'portolaplaza', path: '/property_types/portolaplaza.json' },
        ];

        const propertyData = await Promise.all(
          propertyFiles.map(async ({ id, path }) => {
            const response = await fetch(path);
            const data = await response.json();
            return { ...data, id };
          })
        );

        setProperties(propertyData);
      } catch (error) {
        console.error('Error loading property data:', error);
      }
    };

    loadProperties();
  }, []);

  return (
    <div className="property-table">
      {properties.length === 0 ? (
        <p className="no-properties">No properties added yet.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Property Name</th>
                <th>City</th>
                <th>Net Op Inc YTD</th>
                <th>Cash YTD</th>
                <th>Net Cash Flow This Month</th>
                <th>Vacancy (%)</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr key={property.id}>
                  <td>
                    <button
                      className="property-button"
                      onClick={() => onPropertyClick(property.id)}
                    >
                      {property.propertyName}
                    </button>
                  </td>
                  <td>{property.city}</td>
                  <td>${property.noiYTD.toLocaleString()}</td>
                  <td>${property.cashYTD.toLocaleString()}</td>
                  <td>${property.netCashFlowThisMonth.toLocaleString()}</td>
                  <td>{property.vacancy}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style jsx>{`
        .property-table {
          margin-top: 20px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .table-wrapper {
          overflow-x: auto;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }
        th, td {
          padding: 12px;
          border-bottom: 1px solid #ddd;
          text-align: left;
        }
        th {
          background-color: #f1f1f1;
        }
        .property-button {
          background: none;
          border: none;
          color: #007bff;
          cursor: pointer;
          text-decoration: underline;
        }
        .property-button:hover {
          color: #0056b3;
        }
        .no-properties {
          padding: 20px;
          text-align: center;
          color: #666;
        }
        @media (max-width: 768px) {
          th, td {
            padding: 8px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default PropertyTable;
