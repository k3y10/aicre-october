import React, { useEffect, useState } from 'react';

// Define the property data interface
interface PropertyData {
  propertyName: string;
  noi: number;
  value: number;
  leverage: number;
  yieldRate: number;
  dscr: number;
  opportunity: string;
}

// Define the forecast data interface
interface ForecasterData {
  year: number;
  noiProjection: number;
  valueProjection: number;
}

const propertyTypes = ['commercial', 'residential', 'recreational', 'retail'];

const Forecaster: React.FC = () => {
  const [propertyType, setPropertyType] = useState<string>('commercial');
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');
  const [forecastData, setForecastData] = useState<ForecasterData[]>([]);

  useEffect(() => {
    // Fetch the properties from the selected property type
    const fetchProperties = async () => {
      try {
        const response = await fetch(`/property_types/${propertyType}.json`);
        const data: PropertyData[] = await response.json();
        setProperties(data);
        setSelectedPropertyId(data[0]?.propertyName || ''); // Default to the first property
      } catch (error) {
        console.error('Error loading property data:', error);
      }
    };

    fetchProperties();
  }, [propertyType]);

  useEffect(() => {
    if (!selectedPropertyId) return;

    // Find the selected property and calculate projections
    const selectedProperty = properties.find((property) => property.propertyName === selectedPropertyId);
    if (selectedProperty) {
      const projections = calculateProjections(selectedProperty);
      setForecastData(projections);
    }
  }, [selectedPropertyId, properties]);

  const calculateProjections = (property: PropertyData): ForecasterData[] => {
    const projections: ForecasterData[] = [];
    const projectionYears = 5;
    const growthRate = 0.05; // Assume a 5% growth rate for NOI and value each year

    for (let i = 0; i < projectionYears; i++) {
      const year = new Date().getFullYear() + i;
      const noiProjection = property.noi * Math.pow(1 + growthRate, i);
      const valueProjection = property.value * Math.pow(1 + growthRate, i);

      projections.push({
        year,
        noiProjection,
        valueProjection,
      });
    }

    return projections;
  };

  const handlePropertyTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPropertyType(e.target.value);
  };

  const handlePropertyIdChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPropertyId(e.target.value);
  };

  return (
    <div className="forecaster">
      <h2>Financial Forecaster</h2>

      {/* Property Type Selector */}
      <div className="selectors">
        <label>
          Property Type:
          <select value={propertyType} onChange={handlePropertyTypeChange}>
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </label>

        {/* Property Selector */}
        <label>
          Property:
          <select value={selectedPropertyId} onChange={handlePropertyIdChange}>
            {properties.map((property) => (
              <option key={property.propertyName} value={property.propertyName}>
                {property.propertyName}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Forecast Data Table */}
      <table>
        <thead>
          <tr>
            <th>Year</th>
            <th>NOI Projection</th>
            <th>Value Projection</th>
          </tr>
        </thead>
        <tbody>
          {forecastData.map((entry, index) => (
            <tr key={index}>
              <td>{entry.year}</td>
              <td>${entry.noiProjection.toLocaleString()}</td>
              <td>${entry.valueProjection.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <style jsx>{`
        .forecaster {
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 30px;
        }

        .selectors {
          margin-bottom: 20px;
        }

        label {
          margin-right: 15px;
        }

        select {
          margin-left: 10px;
          padding: 8px;
          border-radius: 5px;
          border: 1px solid #ddd;
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
      `}</style>
    </div>
  );
};

export default Forecaster;
