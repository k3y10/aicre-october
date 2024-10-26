import React, { useState, useEffect } from 'react';

interface Property {
  id: string;
  propertyName: string;
  noi: number;
  value: number;
  dscr: number;
  leverage: number;
  location: string;
}

const propertyTypes = ['all', 'commercial', 'residential', 'recreational', 'retail']; // Include "all" option

const HeatMap: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [propertyType, setPropertyType] = useState<string>('all'); // Default to "all" to load all properties

  useEffect(() => {
    // Fetch property data based on selected property type
    const fetchData = async () => {
      try {
        const response = await fetch(`/property_types/${propertyType}.json`);
        const data: Property[] = await response.json();
        setProperties(data);
      } catch (error) {
        console.error('Error loading property data:', error);
      }
    };

    fetchData();
  }, [propertyType]);

  const getColorForProperty = (noi: number) => {
    if (noi > 80000) {
      return 'green'; // High NOI
    } else if (noi < 50000) {
      return 'red'; // Low NOI
    } else {
      return '#f1c40f'; // Softer yellow
    }
  };

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
  };

  const handlePropertyTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPropertyType(e.target.value);
  };

  return (
    <div className="heatmapPage">
      <h1>CRE Property Heatmap</h1>

      {/* Dropdown to select the property type */}
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
      </div>

      {/* Display the heatmap grid */}
      <div className="heatmapGrid">
        {properties.map((property) => (
          <div
            key={property.id}
            className="propertySquare"
            style={{
              backgroundColor: getColorForProperty(property.noi),
              flexBasis: `${property.value / 10000}%`,
            }}
            onClick={() => handlePropertyClick(property)}
          >
            <div className="propertyInfo">
              <h4>{property.propertyName}</h4>
              <p>NOI: ${property.noi.toLocaleString()}</p>
              <p>Value: ${property.value.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Display selected property details */}
      {selectedProperty && (
        <div className="propertyDetails">
          <h3>Selected Property: {selectedProperty.propertyName}</h3>
          <p>Location: {selectedProperty.location}</p>
          <p>NOI: ${selectedProperty.noi.toLocaleString()}</p>
          <p>Value: ${selectedProperty.value.toLocaleString()}</p>
          <p>DSCR: {selectedProperty.dscr}</p>
          <p>Leverage: {selectedProperty.leverage * 100}%</p>
        </div>
      )}

      <style jsx>{`
        .heatmapPage {
          padding: 20px;
        }

        h1 {
          text-align: center;
          margin-bottom: 20px;
        }

        .selectors {
          margin-bottom: 20px;
          text-align: center;
        }

        select {
          margin-left: 10px;
          padding: 8px;
          border-radius: 5px;
          border: 1px solid #ddd;
        }

        .heatmapGrid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
        }

        .propertySquare {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 10px;
          border-radius: 8px;
          color: white;
          text-align: center;
          cursor: pointer;
          transition: transform 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .propertySquare:hover {
          transform: scale(1.05);
        }

        .propertyInfo h4 {
          font-size: 14px;
          margin-bottom: 5px;
        }

        .propertyInfo p {
          font-size: 12px;
          margin: 2px 0;
        }

        .propertyDetails {
          margin-top: 30px;
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .propertyDetails h3 {
          margin-bottom: 10px;
        }

        .propertyDetails p {
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .heatmapGrid {
            flex-direction: column;
          }

          .propertySquare {
            flex-basis: 100%;
          }

          .propertyDetails {
            margin-top: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default HeatMap;
