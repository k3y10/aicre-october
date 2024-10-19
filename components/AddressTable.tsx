import React from 'react';

interface AddressTableProps {
  addresses: {
    propertyName: string;
    type: string;
    address: string;
    noi: number;
    value: number;
    leverage: number;
    yieldRate: number;
    dscr: number;
    opportunity: string;
  }[];
  onRemove: (index: number) => void; // Callback to remove an address
}

const AddressTable: React.FC<AddressTableProps> = ({ addresses, onRemove }) => {
  return (
    <div className="address-table">
      <h3>Saved Properties</h3>
      {addresses.length === 0 ? (
        <p className="no-address">No addresses added yet.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Property Name</th>
                <th>Type</th>
                <th>Address</th>
                <th>NOI</th>
                <th>Value</th>
                <th>Leverage</th>
                <th>Yield Rate</th>
                <th>DSCR</th>
                <th>Opportunity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {addresses.map((item, index) => (
                <tr key={index}>
                  <td>{item.propertyName}</td>
                  <td>{item.type}</td>
                  <td>{item.address}</td>
                  <td>${item.noi.toLocaleString()}</td>
                  <td>${item.value.toLocaleString()}</td>
                  <td>{(item.leverage * 100).toFixed(2)}%</td>
                  <td>{(item.yieldRate * 100).toFixed(2)}%</td>
                  <td>{item.dscr.toFixed(2)}</td>
                  <td>{item.opportunity}</td>
                  <td>
                    <button onClick={() => onRemove(index)} className="remove-button">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style jsx>{`
        .address-table {
          margin-top: 10px;
          width: 100%;
        }

        .table-wrapper {
          overflow-x: auto; /* Ensures table doesn't overflow horizontally */
          width: 100%;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        th, td {
          padding: 10px;
          border: 1px solid #ccc;
          text-align: left;
        }

        th {
          background-color: #ffffff;
          font-weight: bold;
        }

        .remove-button {
          background-color: #ff4d4d;
          color: white;
          padding: 5px 10px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .remove-button:hover {
          background-color: #e60000;
        }

        .no-address {
          font-style: italic;
          color: #888;
        }

        @media (max-width: 768px) {
          table {
            font-size: 12px;
          }

          th, td {
            padding: 8px;
          }

          .remove-button {
            padding: 4px 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default AddressTable;
