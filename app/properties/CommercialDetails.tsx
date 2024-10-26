import React, { useEffect, useState } from 'react';
import AddressTable from '@/components/AddressTable'; // Import the PropertyForm component
import PropertyForm from '@/components/PropertyForm';

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
  image: string | null; // Allow image to be string or null
}

interface CommercialDetailsProps {
  selectedPropertyId: string; // ID passed in from the dashboard or sidebar
}

const CommercialDetails: React.FC<CommercialDetailsProps> = ({ selectedPropertyId }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [addresses, setAddresses] = useState<Property[]>([]);

  // Fetch the property data from the commercial.json file and set the selected property
  useEffect(() => {
    fetch('/property_types/commercial.json')
      .then((response) => response.json())
      .then((data) => {
        setProperties(data);
        const property = data.find((p: Property) => p.id === selectedPropertyId);
        setSelectedProperty(property || data[0]); // Default to the first property if not found
      })
      .catch((error) => console.error('Error loading properties:', error));
  }, [selectedPropertyId]);

  const handleAddNewAddress = (newAddress: Property) => {
    setAddresses((prevAddresses) => [...prevAddresses, newAddress]);
  };

  const handleRemoveAddress = (index: number) => {
    setAddresses((prevAddresses) => prevAddresses.filter((_, i) => i !== index));
  };

  if (!selectedProperty) return <div>Loading property details...</div>;

  return (
    <div className="property-details">
      {/* Property selector */}
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

      {/* Property Header */}
      <div className="property-header">
        {selectedProperty.image ? (
          <img src={selectedProperty.image} alt={selectedProperty.propertyName} className="property-image" />
        ) : (
          <div className="no-image">No Image Available</div> // Fallback if image is null
        )}
        <div className="property-info">
          <h2>{selectedProperty.propertyName}</h2>
          <p className="property-type">{selectedProperty.type}</p>
          <p className="property-address">{selectedProperty.address}</p>
        </div>
      </div>

      {/* Address Table to display saved properties */}
      <div className="table-section">
        <AddressTable addresses={addresses} onRemove={handleRemoveAddress} />
      </div>

      {/* Property Form to add new properties */}
      <div className="form-section">
        <h3>Add New Property</h3>
        <PropertyForm onAddNewAddress={handleAddNewAddress} />
      </div>

      {/* Styling for the component */}
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

        .no-image {
          width: 150px;
          height: 150px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f0f0f0;
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

        .property-selector {
          margin-top: 5px;
          margin-bottom: 25px;
        }

        .form-section {
          margin-top: 20px;
        }

        .table-section {
          width: 100%;
          overflow-x: auto; /* Enable horizontal scrolling */
          overflow-y: auto; /* Enable vertical scrolling */
          max-height: 400px; /* Set a max height for vertical scrolling */
          display: flex;
          justify-content: center;
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

export default CommercialDetails;
