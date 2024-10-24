import React, { useEffect, useState } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

interface Property {
  id: string;
  propertyName: string;
  type: string;
  address: string;
  noi: number;
  value: number;
  leverage: number;
  yieldRate: number;
  dscr: number;
  opportunity: string;
  image: string;
}

interface PropertyDetailsProps {
  selectedPropertyId: string; // ID passed in from the dashboard or sidebar
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ selectedPropertyId }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  useEffect(() => {
    // Fetch the property data from the JSON file
    fetch('/property/property.json')
      .then((response) => response.json())
      .then((data) => {
        setProperties(data);
        const property = data.find((p: Property) => p.id === selectedPropertyId);
        setSelectedProperty(property || data[0]); // Set the default property if not found
      })
      .catch((error) => console.error('Error loading properties:', error));
  }, [selectedPropertyId]);

  if (!selectedProperty) return <div>Loading property details...</div>;

  return (
    <div className="property-details">
      {/* Dropdown to select properties */}
      <div className="property-selector">
        <label>Commercial Properties: </label>
        <select
          value={selectedProperty.id}
          onChange={(e) => {
            const property = properties.find((p) => p.id === e.target.value);
            if (property) setSelectedProperty(property);
          }}
        >
          {properties.map((property) => (
            <option key={property.id} value={property.id}>
              {property.propertyName}
            </option>
          ))}
        </select>
      </div>
      <div className="property-header">
        <img src={selectedProperty.image} alt={selectedProperty.propertyName} className="property-image" />
        <div className="property-info">
          <h2>{selectedProperty.propertyName}</h2>
          <p className="property-type">{selectedProperty.type}</p>
          <p className="property-address">{selectedProperty.address}</p>
        </div>
      </div>

      <div className="property-stats">
        <div className="stat">
          <p>NOI</p>
          <h3>{selectedProperty.noi.toLocaleString()}</h3>
          <Tippy content="Net Operating Income">
            <span className="info-icon">ℹ️</span>
          </Tippy>
        </div>
        <div className="stat">
          <p>Value</p>
          <h3>${selectedProperty.value.toLocaleString()}</h3>
          <Tippy content="The total market value of the property">
            <span className="info-icon">ℹ️</span>
          </Tippy>
        </div>
        <div className="stat">
          <p>Leverage</p>
          <h3>{(selectedProperty.leverage * 100).toFixed(2)}%</h3>
          <Tippy content="The percentage of the property value that is leveraged by loans">
            <span className="info-icon">ℹ️</span>
          </Tippy>
        </div>
        <div className="stat">
          <p>Yield Rate</p>
          <h3>{(selectedProperty.yieldRate * 100).toFixed(2)}%</h3>
          <Tippy content="Annual income (NOI) divided by property value">
            <span className="info-icon">ℹ️</span>
          </Tippy>
        </div>
        <div className="stat">
          <p>DSCR</p>
          <h3>{selectedProperty.dscr.toFixed(2)}</h3>
          <Tippy content="Debt Service Coverage Ratio: NOI divided by total debt service">
            <span className="info-icon">ℹ️</span>
          </Tippy>
        </div>
        <div className="stat">
          <p>Opportunity</p>
          <h3>{selectedProperty.opportunity}</h3>
          <Tippy content="Describes the growth or investment opportunity for this property">
            <span className="info-icon">ℹ️</span>
          </Tippy>
        </div>
      </div>

      <style jsx>{`
        .property-details {
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 30px;
        }

        .property-header {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }

        .property-image {
          width: 150px;
          height: 150px;
          object-fit: cover;
          border-radius: 8px;
          margin-right: 20px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }

        .property-info {
          flex: 1;
        }

        .property-type,
        .property-address {
          margin-top: 5px;
          color: #555;
        }

        .property-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .stat {
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
        }

        .stat p {
          font-size: 14px;
          color: #666;
          margin-bottom: 10px;
        }

        .stat h3 {
          font-size: 24px;
          margin: 0;
        }

        .info-icon {
          cursor: pointer;
          font-size: 14px;
          color: #007bff;
        }

        .property-selector {
          margin-top: 5px;
          margin-bottom: 25px;
        }

        @media (max-width: 768px) {
          .property-stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default PropertyDetails;
