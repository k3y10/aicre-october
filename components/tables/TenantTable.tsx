import React from 'react';

interface Tenant {
  id: string;
  propertyName: string;
  termEnd: string;
  notes: string;
}

interface PropertyPerformance {
  propertyName: string;
  operatingPerformance: number;
  operatingExpenses: number;
  netOperatingIncome: number;
  cashBalance: number;
  accountsReceivable: number;
  tenants: Tenant[];
}

interface AddressTable2Props {
  properties: PropertyPerformance[];
}

const AddressTable2: React.FC<AddressTable2Props> = ({ properties }) => {
  return (
    <div className="address-table">
      {properties.length === 0 ? (
        <p className="no-address">No properties added yet.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Property Name</th>
                <th>Operating Performance</th>
                <th>Operating Expenses</th>
                <th>Net Operating Income</th>
                <th>Cash Balance</th>
                <th>Accounts Receivable</th>
                <th>Tenants</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property, propertyIndex) => (
                <tr key={property.propertyName}>
                  <td>{property.propertyName}</td>
                  <td>${property.operatingPerformance.toLocaleString()}</td>
                  <td>${property.operatingExpenses.toLocaleString()}</td>
                  <td>${property.netOperatingIncome.toLocaleString()}</td>
                  <td>${property.cashBalance.toLocaleString()}</td>
                  <td>${property.accountsReceivable.toLocaleString()}</td>
                  <td>
                    <table className="tenant-table">
                      <thead>
                        <tr>
                          <th>Tenant</th>
                          <th>Term End</th>
                          <th>Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {property.tenants.map((tenant) => (
                          <tr key={tenant.id}>
                            <td>{tenant.propertyName}</td>
                            <td>{tenant.termEnd}</td>
                            <td>{tenant.notes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
          overflow-x: auto;
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
        .tenant-table {
          width: 100%;
          margin-top: 8px;
          border-collapse: collapse;
        }
        .tenant-table th, .tenant-table td {
          padding: 5px;
          border: 1px solid #ddd;
          font-size: 12px;
          text-align: left;
        }
      `}</style>
    </div>
  );
};

export default AddressTable2;
