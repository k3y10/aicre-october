import React, { useState, useEffect } from 'react';

interface PropertyData {
  propertyName: string;
  noi: number;
  value: number;
  leverage: number;
}

const StressTester: React.FC = () => {
  const [propertyType, setPropertyType] = useState<string>('commercial');
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<PropertyData | null>(null);
  const [interestRate, setInterestRate] = useState<number>(3); // Default rate
  const [noiImpact, setNoiImpact] = useState<number>(0);
  const [valueImpact, setValueImpact] = useState<number>(0);

  // Fetch properties based on selected property type
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(`/property_types/${propertyType}.json`);
        const data: PropertyData[] = await response.json();
        setProperties(data);
        if (data.length > 0) {
          setSelectedProperty(data[0]); // Default to the first property
        }
      } catch (error) {
        console.error('Error loading properties:', error);
      }
    };

    fetchProperties();
  }, [propertyType]);

  const handleTest = () => {
    if (!selectedProperty) return;

    const { noi, value } = selectedProperty;

    // Simulate impact based on interest rate changes
    const noiChange = noi * (interestRate / 100);
    const valueChange = value * (interestRate / 100);

    setNoiImpact(noiChange);
    setValueImpact(valueChange);
  };

  return (
    <div className="stress-tester">
      <h2>Financial Stress Tester</h2>

      {/* Property Type Selector */}
      <div className="form-group">
        <label htmlFor="propertyType">Select Property Type:</label>
        <select
          id="propertyType"
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
          className="input-field"
        >
          <option value="commercial">Commercial</option>
          <option value="residential">Residential</option>
          <option value="recreational">Recreational</option>
          <option value="retail">Retail</option>
        </select>
      </div>

      {/* Property Selector */}
      {properties.length > 0 && (
        <div className="form-group">
          <label htmlFor="propertySelect">Select Property:</label>
          <select
            id="propertySelect"
            value={selectedProperty?.propertyName || ''}
            onChange={(e) =>
              setSelectedProperty(
                properties.find((property) => property.propertyName === e.target.value) || null
              )
            }
            className="input-field"
          >
            {properties.map((property) => (
              <option key={property.propertyName} value={property.propertyName}>
                {property.propertyName}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Interest Rate Input */}
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

      {/* Results */}
      {selectedProperty && (
        <div className="results">
          <h3>Results for {selectedProperty.propertyName}</h3>
          <p>
            <strong>NOI Impact:</strong> ${noiImpact.toLocaleString()}
          </p>
          <p>
            <strong>Property Value Impact:</strong> ${valueImpact.toLocaleString()}
          </p>
        </div>
      )}

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
