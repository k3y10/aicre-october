import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSlidersH, faChartLine, faDollarSign } from '@fortawesome/free-solid-svg-icons';

const Scenario: React.FC = () => {
  const [interestRate, setInterestRate] = useState<number>(3); // Default interest rate
  const [noiImpact, setNoiImpact] = useState<number>(0);
  const [valueImpact, setValueImpact] = useState<number>(0);

  // Handle interest rate change
  const handleInterestRateChange = (value: number | null) => {
    if (value !== null) {
      setInterestRate(value);
      calculateImpact(value);
    }
  };

  // Calculate the impact of interest rate changes on NOI and property value
  const calculateImpact = (rate: number) => {
    const noi = 50000; // Placeholder NOI value
    const value = 500000; // Placeholder property value

    const noiChange = noi * (rate / 100);
    const valueChange = value * (rate / 100);

    setNoiImpact(noiChange);
    setValueImpact(valueChange);
  };

  return (
    <div className="scenario-container">
      <h2>
        <FontAwesomeIcon icon={faChartLine} style={{ marginRight: '8px' }} />
        Scenario Planning
      </h2>
      <div className="input-section">
        <h3>Interest Rate Impact</h3>
        <div className="slider-section">
          <label htmlFor="interestRate">Interest Rate (%)</label>
          <input
            id="interestRate"
            type="range"
            min={0}
            max={10}
            step={0.1}
            value={interestRate}
            onChange={(e) => handleInterestRateChange(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
        <div className="input-number-section">
          <input
            type="number"
            value={interestRate}
            min={0}
            max={10}
            step={0.1}
            onChange={(e) => handleInterestRateChange(Number(e.target.value))}
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
      </div>

      <div className="impact-section">
        <h3>
          <FontAwesomeIcon icon={faDollarSign} style={{ marginRight: '8px' }} />
          Impact on Financials
        </h3>
        <div className="financial-impact">
          <p>NOI Impact: ${noiImpact.toLocaleString()}</p>
          <p>Property Value Impact: ${valueImpact.toLocaleString()}</p>
        </div>
      </div>

      <style jsx>{`
        .scenario-container {
          background-color: #fff;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          max-width: 800px;
          margin: auto;
        }

        h2 {
          display: flex;
          align-items: center;
          font-size: 24px;
          color: #333;
        }

        .input-section {
          margin-top: 20px;
          padding: 20px;
          background-color: #f7f7f7;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .slider-section {
          margin-bottom: 20px;
        }

        .input-number-section {
          margin-bottom: 20px;
        }

        .impact-section {
          margin-top: 30px;
        }

        .financial-impact {
          background-color: #fafafa;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
          font-size: 16px;
        }

        .financial-impact p {
          margin: 10px 0;
        }
      `}</style>
    </div>
  );
};

export default Scenario;
