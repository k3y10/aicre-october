import React, { useEffect, useState } from 'react';

interface SREOEntry {
  propertyName: string;
  ownershipPercentage: number;
  currentValue: number;
  outstandingDebt: number;
  equityValue: number;
}

interface PropertyData {
  propertyName: string;
  sreo: SREOEntry[];
}

const SREOTable: React.FC = () => {
  const [propertyType, setPropertyType] = useState<string>('commercial');
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');
  const [sreoData, setSreoData] = useState<SREOEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch properties based on the selected property type
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/property_types/${propertyType}.json`);
        const data: PropertyData[] = await response.json();
        setProperties(data);
        if (data.length > 0) {
          setSelectedPropertyId(data[0].propertyName); // Set the first property as default
          setSreoData(data[0].sreo || []); // Set SREO data for the first property
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading SREO data:', error);
        setLoading(false);
      }
    };

    fetchProperties();
  }, [propertyType]);

  // Update SREO data when a property is selected
  useEffect(() => {
    if (!selectedPropertyId) return;

    const selectedProperty = properties.find(
      (property) => property.propertyName === selectedPropertyId
    );
    if (selectedProperty) {
      setSreoData(selectedProperty.sreo || []);
    }
  }, [selectedPropertyId, properties]);

  // Function to handle CSV download
  const downloadTableAsCSV = () => {
    const csvData = [
      ['Property Name', 'Ownership (%)', 'Current Value', 'Outstanding Debt', 'Equity Value'],
      ...sreoData.map(entry => [
        entry.propertyName,
        entry.ownershipPercentage.toFixed(2),
        entry.currentValue.toLocaleString(),
        entry.outstandingDebt.toLocaleString(),
        entry.equityValue.toLocaleString(),
      ]),
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      csvData.map(row => row.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'SREO_data.csv');
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div>Loading Schedule of Real Estate Owned (SREO)...</div>;
  }

  return (
    <div className="sreo-table">
      <h2>Schedule of Real Estate Owned</h2>

      {/* Dropdown for Property Type */}
      <div className="property-selector">
        <label htmlFor="propertyTypeSelect">Select Property Type: </label>
        <select
          id="propertyTypeSelect"
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
        >
          <option value="commercial">Commercial</option>
          <option value="residential">Residential</option>
          <option value="recreational">Recreational</option>
          <option value="retail">Retail</option>
        </select>
      </div>

      {/* Dropdown for Property Selection */}
      <div className="property-selector">
        <label htmlFor="propertySelect">Select Property: </label>
        <select
          id="propertySelect"
          value={selectedPropertyId}
          onChange={(e) => setSelectedPropertyId(e.target.value)}
        >
          {properties.map((property) => (
            <option key={property.propertyName} value={property.propertyName}>
              {property.propertyName}
            </option>
          ))}
        </select>
      </div>

      {/* SREO Table */}
      <table>
        <thead>
          <tr>
            <th>Property Name</th>
            <th>Ownership (%)</th>
            <th>Current Value</th>
            <th>Outstanding Debt</th>
            <th>Equity Value</th>
          </tr>
        </thead>
        <tbody>
          {sreoData.length > 0 ? (
            sreoData.map((entry, index) => (
              <tr key={index}>
                <td>{entry.propertyName}</td>
                <td>{entry.ownershipPercentage.toFixed(2)}%</td>
                <td>${entry.currentValue.toLocaleString()}</td>
                <td>${entry.outstandingDebt.toLocaleString()}</td>
                <td>${entry.equityValue.toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>No data available for this property.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Download Button */}
      <button onClick={downloadTableAsCSV} className="download-btn">
        Download Table as CSV
      </button>

      <style jsx>{`
        .sreo-table {
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 30px;
        }

        .property-selector {
          margin-bottom: 20px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        th {
          background-color: #f7f7f7;
          color: #333;
        }

        td {
          color: #555;
        }

        .download-btn {
          margin-top: 20px;
          padding: 10px 15px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .download-btn:hover {
          background-color: #0056b3;
        }

        @media (max-width: 768px) {
          table, thead, tbody, th, td, tr {
            display: block;
          }

          th {
            position: absolute;
            top: -9999px;
            left: -9999px;
          }

          tr {
            border: 1px solid #ddd;
            margin-bottom: 10px;
          }

          td {
            padding-left: 50%;
            position: relative;
            text-align: right;
          }

          td:before {
            position: absolute;
            left: 10px;
            content: attr(data-label);
            font-weight: bold;
          }
        }
      `}</style>
    </div>
  );
};

export default SREOTable;
