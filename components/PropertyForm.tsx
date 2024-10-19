import React, { useState } from 'react';

type PropertyFormProps = {
  onAddNewAddress: (newAddress: Address) => void;
};

type Address = {
  propertyName: string;
  type: string;
  address: string;
  noi: number;
  value: number;
  leverage: number;
  yieldRate: number;
  dscr: number;
  opportunity: string;
};

const PropertyForm: React.FC<PropertyFormProps> = ({ onAddNewAddress }) => {
  const [newAddress, setNewAddress] = useState<Address>({
    propertyName: '',
    type: '',
    address: '',
    noi: 0,
    value: 0,
    leverage: 0,
    yieldRate: 0,
    dscr: 0,
    opportunity: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddNewAddress(newAddress);
    setNewAddress({
      propertyName: '',
      type: '',
      address: '',
      noi: 0,
      value: 0,
      leverage: 0,
      yieldRate: 0,
      dscr: 0,
      opportunity: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="property-form">
      <div className="form-grid">
        <div className="form-group">
          <label>Property Name</label>
          <input
            type="text"
            name="propertyName"
            value={newAddress.propertyName}
            onChange={handleInputChange}
            placeholder="e.g., Red Headed Child"
            required
          />
        </div>

        <div className="form-group">
          <label>Type</label>
          <input
            type="text"
            name="type"
            value={newAddress.type}
            onChange={handleInputChange}
            placeholder="e.g., Residential"
            required
          />
        </div>

        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={newAddress.address}
            onChange={handleInputChange}
            placeholder="e.g., 1234 Main St."
            required
          />
        </div>

        <div className="form-group">
          <label>NOI</label>
          <input
            type="number"
            name="noi"
            value={newAddress.noi}
            onChange={handleInputChange}
            placeholder="e.g., 50000"
          />
        </div>

        <div className="form-group">
          <label>Value</label>
          <input
            type="number"
            name="value"
            value={newAddress.value}
            onChange={handleInputChange}
            placeholder="e.g., 1000000"
          />
        </div>

        <div className="form-group">
          <label>Leverage</label>
          <input
            type="number"
            name="leverage"
            value={newAddress.leverage}
            onChange={handleInputChange}
            placeholder="e.g., 70"
          />
        </div>

        <div className="form-group">
          <label>Yield Rate (%)</label>
          <input
            type="number"
            name="yieldRate"
            value={newAddress.yieldRate}
            onChange={handleInputChange}
            placeholder="e.g., 5"
          />
        </div>

        <div className="form-group">
          <label>DSCR</label>
          <input
            type="number"
            name="dscr"
            value={newAddress.dscr}
            onChange={handleInputChange}
            placeholder="e.g., 1.5"
          />
        </div>

        <div className="form-group">
          <label>Opportunity</label>
          <input
            type="text"
            name="opportunity"
            value={newAddress.opportunity}
            onChange={handleInputChange}
            placeholder="e.g., High Growth"
          />
        </div>
      </div>

      <button type="submit" className="submit-button">Add Property</button>

      <style jsx>{`
        .property-form {
          background-color: #ffffff;
          padding: 20px;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          width: 100%; /* Full width for the form */
          max-width: 100%;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr); /* Two columns layout */
          gap: 20px;
          width: 100%;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
        }

        .form-group input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }

        .submit-button {
          background-color: #64E2E2;
          color: white;
          padding: 10px 15px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 20px;
        }

        .submit-button:hover {
          background-color: #5FD2D2;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr; /* Single column layout for smaller screens */
          }
        }
      `}</style>
    </form>
  );
};

export default PropertyForm;
