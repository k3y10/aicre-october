import React, { useEffect, useState } from 'react';

interface SREOEntry {
  propertyName: string;
  ownershipPercentage: number;
  currentValue: number;
  outstandingDebt: number;
  equityValue: number;
}

interface SREOTableProps {
  userId: string;
}

const SREOTable: React.FC<SREOTableProps> = ({ userId }) => {
  const [sreoData, setSreoData] = useState<SREOEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch SREO data based on userId
    fetch(`/api/user/${userId}/sreo`)
      .then((response) => response.json())
      .then((data) => {
        setSreoData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading SREO data:', error);
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return <div>Loading Schedule of Real Estate Owned (SREO)...</div>;
  }

  return (
    <div className="sreo-table">
      <h2>Schedule of Real Estate Owned</h2>
      <table>
        <thead>
          <tr>
            <th>Property Name</th>
            <th>Ownership (%)</th>
            <th>Current Value</th>
            <th>Outstanding Debt</th>
            <th>Equity Value</th>
          </tr>
        </thead>
        <tbody>
          {sreoData.map((entry, index) => (
            <tr key={index}>
              <td>{entry.propertyName}</td>
              <td>{entry.ownershipPercentage.toFixed(2)}%</td>
              <td>${entry.currentValue.toLocaleString()}</td>
              <td>${entry.outstandingDebt.toLocaleString()}</td>
              <td>${entry.equityValue.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <style jsx>{`
        .sreo-table {
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 30px;
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
          background-color: #f7f7f7;
          color: #333;
        }

        td {
          color: #555;
        }

        @media (max-width: 768px) {
          table, thead, tbody, th, td, tr {
            display: block;
          }

          th {
            position: absolute;
            top: -9999px;
            left: -9999px;
          }

          tr {
            border: 1px solid #ddd;
            margin-bottom: 10px;
          }

          td {
            padding-left: 50%;
            position: relative;
            text-align: right;
          }

          td:before {
            position: absolute;
            left: 10px;
            content: attr(data-label);
            font-weight: bold;
          }
        }
      `}</style>
    </div>
  );
};

export default SREOTable;
