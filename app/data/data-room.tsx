import React, { useState } from 'react';
import { FileUpload } from '@/components/icons';
import DataUpload from '@/components/tools/DataUpload';

const DataRoom: React.FC = () => {
  const [syncData, setSyncData] = useState<any>(null);  // To handle uploaded property data
  const [zillowData, setZillowData] = useState<any>(null);  // To handle Zillow data
  const [address, setAddress] = useState<string>('');  // User-inputted address

  // Handler to get data synced from the uploaded document
  const handleDataSync = (data: any) => {
    setSyncData(data);
  };

  // Function to trigger Zillow data fetch
  const fetchZillowData = async () => {
    if (address) {
      try {
        const response = await fetch(`/api/zillow?address=${encodeURIComponent(address)}`);  // Call to backend API
        const data = await response.json();
        setZillowData(data);  // Set the retrieved Zillow data
      } catch (error) {
        console.error('Error fetching Zillow data:', error);  // Handle fetch errors
      }
    }
  };

  return (
    <div className="data-room">
      <h3>Data Room</h3>

      {/* File Upload Section */}
      <div className="upload-section">
        <FileUpload />
        <p>Upload Property Data</p>
      </div>

      <DataUpload onDataSync={handleDataSync} />


      {/* Display uploaded and processed data */}
      {syncData && (
        <div className="data-sync-results">
          <h4>Uploaded Data Results:</h4>
          <div>
            <h5>Property Details:</h5>
            <p>Address: {syncData.property_details.address}</p>
          </div>
          <div>
            <h5>Tenants:</h5>
            {syncData.tenants.map((tenant: any, index: number) => (
              <div key={index} className="tenant-details">
                <p>Name: {tenant.tenant_name}</p>
                <p>Amount: {tenant.amount}</p>
                <p>Status: {tenant.status}</p>
              </div>
            ))}
          </div>
        </div>
      )}


      {/* Display Zillow scraped data */}
      {zillowData && (
        <div className="zillow-results">
          <h4>Zillow Data Results:</h4>
          <pre>{JSON.stringify(zillowData, null, 2)}</pre>
        </div>
      )}

      <style jsx>{`
        .data-room {
          padding: 20px;
          background: #f9f9f9;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .upload-section {
          display: flex;
          align-items: center;
          gap: 10px;
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
        }

        .upload-section p {
          margin: 0;
          font-size: 16px;
          color: #333;
        }

        .zillow-fetch-section {
          margin-top: 20px;
          display: flex;
          align-items: center;
        }

        .data-sync-results, .zillow-results {
          margin-top: 20px;
          background-color: #fff;
          padding: 15px;
          border-radius: 8px;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
          white-space: pre-wrap;
        }

        pre {
          font-size: 14px;
          color: #555;
        }
      `}</style>
    </div>
  );
};

export default DataRoom;
