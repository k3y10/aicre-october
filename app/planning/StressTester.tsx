import React, { useState, useEffect } from 'react';

interface StressTesterProps {
  propertyId: string; // Pass property ID to dynamically fetch property data
}

interface PropertyData {
  noi: number;
  value: number;
  leverage: number;
}

const StressTester: React.FC<StressTesterProps> = ({ propertyId }) => {
  const [interestRate, setInterestRate] = useState<number>(3); // Default rate
  const [noiImpact, setNoiImpact] = useState<number>(0);
  const [valueImpact, setValueImpact] = useState<number>(0);
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);

  // Fetch property data dynamically based on propertyId
  useEffect(() => {
    fetch(`/property/${propertyId}/data.json`)
      .then((response) => response.json())
      .then((data) => setPropertyData(data))
      .catch((error) => console.error('Error fetching property data:', error));
  }, [propertyId]);

  const handleTest = () => {
    if (!propertyData) return;

    const { noi, value } = propertyData;

    // Simulate impact based on interest rate changes
    const noiChange = noi * (interestRate / 100);
    const valueChange = value * (interestRate / 100);

    setNoiImpact(noiChange);
    setValueImpact(valueChange);
  };

  if (!propertyData) {
    return <div>Loading property data...</div>;
  }

  return (
    <div className="stress-tester">
      <h2>Financial Stress Tester</h2>
      <div className="form-group">
        <label>Interest Rate Change (%)</label>
        <input
          type="number"
          value={interestRate}
          onChange={(e) => setInterestRate(Number(e.target.value))}
          step="0.01"
          className="input-field"
        />
      </div>

      <button onClick={handleTest} className="run-test-button">
        Run Test
      </button>

      <div className="results">
        <h3>Results</h3>
        <p>
          <strong>NOI Impact:</strong> ${noiImpact.toLocaleString()}
        </p>
        <p>
          <strong>Property Value Impact:</strong> ${valueImpact.toLocaleString()}
        </p>
      </div>

      <style jsx>{`
        .stress-tester {
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 30px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .input-field {
          width: 100%;
          padding: 10px;
          border-radius: 4px;
          border: 1px solid #ddd;
        }

        .run-test-button {
          background-color: #007bff;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .run-test-button:hover {
          background-color: #0056b3;
        }

        .results {
          margin-top: 20px;
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
        }

        .results h3 {
          margin-bottom: 15px;
          color: #333;
        }

        .results p {
          font-size: 16px;
          color: #555;
        }
      `}</style>
    </div>
  );
};

export default StressTester;
