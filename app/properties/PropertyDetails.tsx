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

interface CommercialDetailsProps {
  selectedPropertyId: string; // Accept selectedPropertyId as a prop
}

const CommercialDetails: React.FC<CommercialDetailsProps> = ({ selectedPropertyId }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [addresses, setAddresses] = useState<Property[]>([]); // Addresses to display in the table

  // Fetch property data from the commercial.json file
  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        const response = await fetch('/property_types/commercial.json'); // Fetch commercial.json
        const data: Property[] = await response.json();
        setProperties(data);

        const property = data.find((p) => p.id === selectedPropertyId); // Use the prop to find the property
        setSelectedProperty(property || data[0]); // Default to the first property if not found
        setAddresses(data); // Set addresses to display in the table
      } catch (error) {
        console.error('Error loading properties:', error);
      }
    };

    fetchPropertyData();
  }, [selectedPropertyId]); // Add selectedPropertyId to the dependency array

  const handleAddNewAddress = (newAddress: Property) => {
    setProperties((prevProperties) => [...prevProperties, newAddress]); // Add new property
    setAddresses((prevAddresses) => [...prevAddresses, newAddress]); // Add new address to the table
  };

  const handleRemoveAddress = (index: number) => {
    setProperties((prevProperties) => prevProperties.filter((_, i) => i !== index));
    setAddresses((prevAddresses) => prevAddresses.filter((_, i) => i !== index)); // Update table
  };

  const toggleFormVisibility = () => {
    setIsFormVisible((prevState) => !prevState); // Toggle form visibility
  };

  // Calculate debt (value * leverage), use optional chaining in case selectedProperty is null
  const debt = selectedProperty?.value && selectedProperty?.leverage
    ? selectedProperty.value * selectedProperty.leverage
    : 0;

  if (!selectedProperty) return <div>Loading property details...</div>;

  return (
    <div className="property-details">
      {/* Property Selector */}
      <div className="property-selector">
        <label>Commercial Properties: </label>
        <select
          value={selectedProperty?.id}
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
        {selectedProperty?.image ? (
          <img src={selectedProperty.image} alt={selectedProperty.propertyName} className="property-image" />
        ) : (
          <div className="no-image">No Image Available</div>
        )}
        <div className="property-info">
          <h2>{selectedProperty?.propertyName}</h2>
          <p className="property-type">{selectedProperty?.type}</p>
          <p className="property-address">{selectedProperty?.address}</p>
        </div>
      </div>

      {/* Property Stats */}
      <div className="property-stats">
        <div className="stat-card">
          <p className="stat-title">(NOI)</p>
          <h4 className="stat-value">${selectedProperty?.noi?.toLocaleString() || 0}</h4>
        </div>
        <div className="stat-card">
          <p className="stat-title">Property Value</p>
          <h4 className="stat-value">${selectedProperty?.value?.toLocaleString() || 0}</h4>
        </div>
        <div className="stat-card">
          <p className="stat-title">Leverage</p>
          <h4 className="stat-value">{(selectedProperty?.leverage * 100 || 0).toFixed(2)}%</h4>
        </div>
        <div className="stat-card">
          <p className="stat-title">Yield Rate</p>
          <h4 className="stat-value">{(selectedProperty?.yieldRate * 100 || 0).toFixed(2)}%</h4>
        </div>
        <div className="stat-card">
          <p className="stat-title">(DSCR)</p>
          <h4 className="stat-value">{selectedProperty?.dscr?.toFixed(2) || 0}</h4>
        </div>
        <div className="stat-card">
          <p className="stat-title">Debt</p>
          <h4 className="stat-value">${debt.toLocaleString()}</h4> {/* Display calculated debt */}
        </div>
      </div>

      {/* Address Table */}
      <div className="table-section">
        <AddressTable addresses={addresses} onRemove={handleRemoveAddress} /> {/* Pass addresses */}
      </div>

      {/* Button to toggle form visibility */}
      <button className="toggle-form-button" onClick={toggleFormVisibility}>
        {isFormVisible ? 'Hide Property Form' : 'Add Property +'}
      </button>

      {/* Property Form */}
      <div className="form-section">
        {isFormVisible && <PropertyForm onAddNewAddress={handleAddNewAddress} />}
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
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .stat-card {
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
        }

        .stat-title {
          font-size: 12px;
          color: #666;
          margin-bottom: 5px;
        }

        .stat-value {
          font-size: 16px;
          font-weight: bold;
          margin: 0;
        }

        .table-section {
          width: 100%;
          overflow-x: auto;
          max-height: 400px;
        }

        .toggle-form-button {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 20px;
        }

        .toggle-form-button:hover {
          background-color: #0056b3;
        }

        @media (max-width: 768px) {
          .property-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .property-stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default CommercialDetails;
