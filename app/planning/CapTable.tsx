import React, { useEffect, useState } from 'react';

interface CapTableEntry {
  investorName: string;
  ownershipPercentage: number;
  investmentAmount: number;
}

interface PropertyData {
  propertyName: string;
  capTable?: CapTableEntry[];  // CapTable could be optional
}

const CapTable: React.FC = () => {
  const [propertyType, setPropertyType] = useState<string>('commercial');
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');
  const [capTable, setCapTable] = useState<CapTableEntry[]>([]);  // Always initialize as empty array
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch properties based on selected property type
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/property_types/${propertyType}.json`);
        const data: PropertyData[] = await response.json();
        setProperties(data);
        if (data.length > 0) {
          setSelectedPropertyId(data[0].propertyName); // Default to the first property
          setCapTable(data[0].capTable || []);  // Default to an empty array if no capTable exists
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading properties:', error);
        setLoading(false);
      }
    };

    fetchProperties();
  }, [propertyType]);

  // Update the cap table when a property is selected
  useEffect(() => {
    if (!selectedPropertyId) return;
    const selectedProperty = properties.find(
      (property) => property.propertyName === selectedPropertyId
    );
    if (selectedProperty) {
      setCapTable(selectedProperty.capTable || []);  // Ensure capTable is either set or an empty array
    }
  }, [selectedPropertyId, properties]);

  if (loading) {
    return <div>Loading Cap Table...</div>;
  }

  return (
    <div className="cap-table">
      <h2>Capitalization Table</h2>

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

      {/* Capitalization Table */}
      <table>
        <thead>
          <tr>
            <th>Investor</th>
            <th>Ownership (%)</th>
            <th>Investment Amount</th>
          </tr>
        </thead>
        <tbody>
          {capTable.length > 0 ? (
            capTable.map((entry, index) => (
              <tr key={index}>
                <td>{entry.investorName}</td>
                <td>{entry.ownershipPercentage.toFixed(2)}%</td>
                <td>${entry.investmentAmount.toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>No data available for this property.</td>
            </tr>
          )}
        </tbody>
      </table>

      <style jsx>{`
        .cap-table {
          background-color: #fff;
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
          background-color: #f4f4f4;
        }

        td {
          color: #333;
        }
      `}</style>
    </div>
  );
};

export default CapTable;
