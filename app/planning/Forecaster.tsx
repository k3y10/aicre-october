import React, { useEffect, useState } from 'react';

interface ForecasterData {
  year: number;
  noiProjection: number;
  valueProjection: number;
}

interface ForecasterProps {
  propertyId: string;
}

const Forecaster: React.FC<ForecasterProps> = ({ propertyId }) => {
  const [forecastData, setForecastData] = useState<ForecasterData[]>([]);

  useEffect(() => {
    fetch(`/property/${propertyId}/forecast.json`) // Dynamic property forecast data
      .then((response) => response.json())
      .then((data) => setForecastData(data))
      .catch((error) => console.error('Error loading forecast data:', error));
  }, [propertyId]);

  return (
    <div className="forecaster">
      <h2>Financial Forecaster</h2>
      <table>
        <thead>
          <tr>
            <th>Year</th>
            <th>NOI Projection</th>
            <th>Value Projection</th>
          </tr>
        </thead>
        <tbody>
          {forecastData.map((entry, index) => (
            <tr key={index}>
              <td>{entry.year}</td>
              <td>${entry.noiProjection.toLocaleString()}</td>
              <td>${entry.valueProjection.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <style jsx>{`
        .forecaster {
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

export default Forecaster;
