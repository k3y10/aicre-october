import React from 'react';

interface Tenant {
  id: string;
  propertyName: string;
  termEnd: string;
  notes: string;
}

interface TenantDetailProps {
  tenant: Tenant | null;
  onBack: () => void;
}

const TenantDetail: React.FC<TenantDetailProps> = ({ tenant, onBack }) => {
  if (!tenant) {
    return <div>No tenant selected.</div>;
  }

  return (
    <div className="tenant-detail">
      <button className="back-button" onClick={onBack}>
        Back to Property Table
      </button>
      <h2>Tenant Details</h2>
      <div className="detail-container">
        <p>
          <strong>Tenant Name:</strong> {tenant.propertyName}
        </p>
        <p>
          <strong>Term End:</strong> {tenant.termEnd}
        </p>
        <p>
          <strong>Notes:</strong> {tenant.notes}
        </p>
      </div>

      <style jsx>{`
        .tenant-detail {
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 8px;
          background-color: #f9f9f9;
        }
        .back-button {
          margin-bottom: 15px;
          background-color: #007bff;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 5px;
          cursor: pointer;
        }
        .back-button:hover {
          background-color: #0056b3;
        }
        .detail-container {
          margin-top: 10px;
        }
        p {
          margin: 8px 0;
        }
      `}</style>
    </div>
  );
};

export default TenantDetail;
