import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface PropertyData {
  propertyName: string;
  noi: number;
  value: number;
  leverage: number;
  yieldRate: number;
  dscr: number;
  opportunity: string;
}

interface ForecasterData {
  year: number;
  monthlyProjections: Array<{ month: string; noiProjection: number; valueProjection: number }>;
}

const propertyTypes = ['commercial', 'residential', 'recreational', 'retail'];
const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

const Forecaster: React.FC = () => {
  const [propertyType, setPropertyType] = useState<string>('commercial');
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');
  const [forecastData, setForecastData] = useState<ForecasterData[]>([]);
  const [activeYear, setActiveYear] = useState<number | null>(null);

  // Slider states
  const [rentForecast, setRentForecast] = useState<number>(0);
  const [householdIncome, setHouseholdIncome] = useState<number>(0);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(`/property_types/${propertyType}.json`);
        const data: PropertyData[] = await response.json();
        setProperties(data);
        setSelectedPropertyId(data[0]?.propertyName || '');
      } catch (error) {
        console.error('Error loading property data:', error);
      }
    };

    fetchProperties();
  }, [propertyType]);

  useEffect(() => {
    if (!selectedPropertyId) return;

    const selectedProperty = properties.find((property) => property.propertyName === selectedPropertyId);
    if (selectedProperty) {
      const projections = calculateProjections(selectedProperty, rentForecast, householdIncome);
      setForecastData(projections);
    }
  }, [selectedPropertyId, properties, rentForecast, householdIncome]);

  const calculateProjections = (property: PropertyData, rentAdjustment: number, incomeAdjustment: number): ForecasterData[] => {
    const projections: ForecasterData[] = [];
    const baseGrowthRate = 0.05;

    const rentGrowthRate = baseGrowthRate + rentAdjustment / 100;
    const incomeGrowthRate = baseGrowthRate + incomeAdjustment / 100;

    for (let i = 0; i < 5; i++) {
      const year = new Date().getFullYear() + i;
      const monthlyProjections = months.map((month, monthIndex) => ({
        month,
        noiProjection: property.noi * Math.pow(1 + rentGrowthRate, i + monthIndex / 12),
        valueProjection: property.value * Math.pow(1 + incomeGrowthRate, i + monthIndex / 12),
      }));
      projections.push({ year, monthlyProjections });
    }

    return projections;
  };

  const handlePropertyTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPropertyType(e.target.value);
  };

  const handlePropertyIdChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPropertyId(e.target.value);
  };

  const toggleYear = (year: number) => {
    setActiveYear(activeYear === year ? null : year);
  };

  return (
    <div className="forecaster">
      <h2>Financial Forecaster</h2>

      {/* Property Type Selector */}
      <div className="selectors">
        <label>
          Property Type:
          <select value={propertyType} onChange={handlePropertyTypeChange}>
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </label>

        <label>
          Property:
          <select value={selectedPropertyId} onChange={handlePropertyIdChange}>
            {properties.map((property) => (
              <option key={property.propertyName} value={property.propertyName}>
                {property.propertyName}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Sliders for Rent Forecast and Household Income */}
      <div className="sliders">
        <div className="slider">
          <label>Rent Forecast: {rentForecast}%</label>
          <input
            type="range"
            min={-10}
            max={10}
            value={rentForecast}
            onChange={(e) => setRentForecast(Number(e.target.value))}
          />
        </div>
        <div className="slider">
          <label>Household Income Score: {householdIncome}%</label>
          <input
            type="range"
            min={-10}
            max={10}
            value={householdIncome}
            onChange={(e) => setHouseholdIncome(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Yearly Forecast Tabs */}
      <div className="year-tabs">
        {forecastData.map((yearData) => (
          <div key={yearData.year} className="year-tab">
            <h3 onClick={() => toggleYear(yearData.year)} className="year-header">
              {yearData.year} {activeYear === yearData.year ? '▼' : '▶'}
            </h3>
            {activeYear === yearData.year && (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>NOI Projection</th>
                      <th>Value Projection</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yearData.monthlyProjections.map((monthData, index) => (
                      <tr key={index}>
                        <td>{monthData.month}</td>
                        <td>${monthData.noiProjection.toLocaleString()}</td>
                        <td>${monthData.valueProjection.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Comparison Image */}
      <div className="comparison-section">
        <h3>Original Scenario Comparison</h3>
        <Image
          src="/forecast.png"
          alt="Original Scenario Table"
          width={800}
          height={200}
          objectFit="contain"
        />
      </div>

      <style jsx>{`
        .forecaster {
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 30px;
          max-width: 1000px;
          margin: auto;
        }

        .selectors {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          margin-bottom: 20px;
        }

        label {
          flex: 1;
        }

        select {
          width: 100%;
          padding: 8px;
          border-radius: 5px;
          border: 1px solid #ddd;
        }

        .sliders {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .slider {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        input[type='range'] {
          width: 100%;
          max-width: 300px;
        }

        .year-tabs {
          margin-top: 20px;
        }

        .year-tab {
          margin-bottom: 10px;
        }

        .year-header {
          font-weight: bold;
          cursor: pointer;
          padding: 10px;
          background-color: #f0f0f0;
          border-radius: 5px;
        }

        .table-container {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          min-width: 500px;
        }

        th, td {
          padding: 10px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        th {
          background-color: #f4f4f4;
        }

        .comparison-section {
          margin-top: 40px;
          text-align: center;
        }

        .comparison-section h3 {
          margin-bottom: 10px;
          color: #333;
        }

        @media (max-width: 768px) {
          .selectors, .sliders {
            flex-direction: column;
          }

          .table-container {
            overflow-x: scroll;
          }

          .year-header {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Forecaster;
