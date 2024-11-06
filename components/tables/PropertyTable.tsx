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
        // Define file paths for each property
        const propertyFiles = [
          { id: 'brickyardplaza', path: '/property_types/brickyardplaza.json' },
          { id: 'portolaplaza', path: '/property_types/portolaplaza.json' },
        ];

        // Load JSON data from each file
        const propertyData = await Promise.all(
          propertyFiles.map(async ({ id, path }) => {
            const response = await fetch(path);
            const data = await response.json();
            return { ...data, id }; // Ensure each property has a unique ID
          })
        );

        // Set properties to state
        setProperties(propertyData);
      } catch (error) {
        console.error('Error loading property data:', error);
      }
    };

    loadProperties();
  }, []);

  return (
    <div className="address-table">
      {properties.length === 0 ? (
        <p className="no-address">No properties added yet.</p>
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
                      className="property-name-button"
                      onClick={() => onPropertyClick(property.id)}
                    >
                      {property.propertyName}
                    </button>
                  </td>
                  <td>{property.city}</td>
                  <td>${property.noiYTD.toLocaleString('en-US')}</td>
                  <td>${property.cashYTD.toLocaleString('en-US')}</td>
                  <td>${property.netCashFlowThisMonth.toLocaleString('en-US')}</td>
                  <td>{property.vacancy}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style jsx>{`
        .address-table {
          margin-top: 10px;
          width: 100%;
        }
        .table-wrapper {
          overflow-x: auto;
          width: 100%;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }
        th, td {
          padding: 10px;
          border: 1px solid #ccc;
          text-align: left;
        }
        th {
          background-color: #ffffff;
          font-weight: bold;
        }
        .no-address {
          font-style: italic;
          color: #888;
        }
        .property-name-button {
          background: none;
          border: none;
          color: #007bff;
          text-decoration: underline;
          cursor: pointer;
          font-size: inherit;
          padding: 0;
        }
        .property-name-button:hover {
          color: #0056b3;
        }
        @media (max-width: 768px) {
          table {
            font-size: 12px;
          }
          th, td {
            padding: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default PropertyTable;
