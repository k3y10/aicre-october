import React, { useEffect, useState } from 'react';
import AddressTable from '@/components/AddressTable';
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
  image: string | null;
}

interface RecreationalDetailsProps {
  selectedPropertyId: string;
}

const RecreationalDetails: React.FC<RecreationalDetailsProps> = ({ selectedPropertyId }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [addresses, setAddresses] = useState<Property[]>([]);

  // Fetch property data from the correct JSON file for recreational properties
  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        const response = await fetch('/property_types/recreational.json'); // Correct JSON path for recreational
        const data = await response.json();
        setProperties(data);
        const property = data.find((p: Property) => p.id === selectedPropertyId);
        setSelectedProperty(property || data[0]);
      } catch (error) {
        console.error('Error loading properties:', error);
      }
    };

    fetchPropertyData();
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
        <label>Recreational Properties: </label>
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
          <div className="no-image">No Image Available</div>
        )}
        <div className="property-info">
          <h2>{selectedProperty.propertyName}</h2>
          <p className="property-type">{selectedProperty.type}</p>
          <p className="property-address">{selectedProperty.address}</p>
        </div>
      </div>

      {/* Address Table */}
      <div className="table-section">
        <AddressTable addresses={addresses} onRemove={handleRemoveAddress} />
      </div>

      {/* Property Form */}
      <div className="form-section">
        <h3>Add New Property</h3>
        <PropertyForm onAddNewAddress={handleAddNewAddress} />
      </div>

      {/* Styles */}
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

        .property-selector {
          margin-top: 5px;
          margin-bottom: 25px;
        }

        .table-section {
          width: 100%;
          overflow-x: auto;
          max-height: 400px;
          display: flex;
          justify-content: center;
        }

        .form-section {
          margin-top: 20px;
        }

        @media (max-width: 768px) {
          .property-header {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default RecreationalDetails;
