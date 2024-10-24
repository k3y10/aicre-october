import React, { useEffect, useState } from 'react';

interface CapTableEntry {
  investorName: string;
  ownershipPercentage: number;
  investmentAmount: number;
}

interface CapTableProps {
  propertyId: string; // Sync this with property details or dashboard
}

const CapTable: React.FC<CapTableProps> = ({ propertyId }) => {
  const [capTable, setCapTable] = useState<CapTableEntry[]>([]);

  useEffect(() => {
    fetch(`/property/${propertyId}/captable.json`) // Fetch dynamically based on property
      .then((response) => response.json())
      .then((data) => setCapTable(data))
      .catch((error) => console.error('Error loading cap table:', error));
  }, [propertyId]);

  return (
    <div className="cap-table">
      <h2>Capitalization Table</h2>
      <table>
        <thead>
          <tr>
            <th>Investor</th>
            <th>Ownership (%)</th>
            <th>Investment Amount</th>
          </tr>
        </thead>
        <tbody>
          {capTable.map((entry, index) => (
            <tr key={index}>
              <td>{entry.investorName}</td>
              <td>{entry.ownershipPercentage.toFixed(2)}%</td>
              <td>${entry.investmentAmount.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <style jsx>{`
        .cap-table {
          background-color: #fff;
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
          background-color: #f4f4f4;
        }
      `}</style>
    </div>
  );
};

export default CapTable;
