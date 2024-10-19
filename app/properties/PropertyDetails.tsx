import React from 'react';
import { BuildingIcon, HomeIcon } from '@/components/icons';

const PropertyDetails: React.FC = () => {
  return (
    <div className="property-details">
      <h3>Property Details</h3>
      <div className="property-grid">
        <div className="property-item">
          <BuildingIcon />
          <p>Commercial Building</p>
        </div>
        <div className="property-item">
          <HomeIcon />
          <p>Residential Property</p>
        </div>
      </div>

      <style jsx>{`
        .property-details {
          padding: 20px;
        }

        .property-grid {
          display: flex;
          gap: 20px;
        }

        .property-item {
          display: flex;
          align-items: center;
          gap: 10px;
          background-color: white;
          padding: 10px;
          border-radius: 8px;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
        }

        .property-item p {
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default PropertyDetails;
