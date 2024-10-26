import React, { useState, useEffect } from 'react';
import { generateCREInsights, fetchCREDataAndMetrics } from "@/utilities/aiUtils";
import MapPlaceholder from '@/components/MapPlaceholder';

interface PropertyInfo {
  propertyId: string;
  propertyName: string;
  value: number;
  noi: number;
  leverage: number;
  dscr: number;
  ownershipPercentage: number;
  location: string; // Ensure location is a string (e.g., an address)
}

interface ScenarioMapProps {
  userId: string;
  properties: PropertyInfo[];
}

const ScenarioMap: React.FC<ScenarioMapProps> = ({ userId, properties }) => {
  const [insights, setInsights] = useState<string | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(properties[0]?.propertyId || '');
  const [propertyMetrics, setPropertyMetrics] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const selectedProperty = properties.find((property) => property.propertyId === selectedPropertyId);

  // Fetch insights when the component mounts
  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      const insightsData = await generateCREInsights(userId, properties);
      setInsights(insightsData);
      setLoading(false);
    };
    fetchInsights();
  }, [userId, properties]);

  // Fetch property data for selected property
  useEffect(() => {
    const fetchMetrics = async () => {
      const metricsData = await fetchCREDataAndMetrics(selectedPropertyId);
      setPropertyMetrics(metricsData);
    };

    if (selectedPropertyId) {
      fetchMetrics();
    }
  }, [selectedPropertyId]);

  const handlePropertyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPropertyId(event.target.value);
  };

  return (
    <div className="scenario-map-container">
      <h2>AiCRE Property Report</h2>

      {/* Property Selector Dropdown */}
      <div className="property-selector">
        <label htmlFor="propertySelect">Select Property: </label>
        <select
          id="propertySelect"
          value={selectedPropertyId}
          onChange={handlePropertyChange}
        >
          {properties.map((property) => (
            <option key={property.propertyId} value={property.propertyId}>
              {property.propertyName}
            </option>
          ))}
        </select>
      </div>

      {/* Placeholder for Map Visualization */}
      <div className="map-section">
        <h3>Map Visualization</h3>
        {selectedProperty && (
          <MapPlaceholder
            propertyId={selectedProperty.propertyId}
            location={selectedProperty.location}
          />
        )}
      </div>

      {/* AI Insights Section */}
      <div className="ai-insights-section">
        <h3>AI Insights</h3>
        {loading ? (
          <p>Loading AI insights...</p>
        ) : insights ? (
          <div className="insights-text">{insights}</div>
        ) : (
          <p>No insights available.</p>
        )}
      </div>

      {/* Property Metrics */}
      <div className="metrics-section">
        <h3>Property Metrics</h3>
        {propertyMetrics ? (
          <div className="metrics-info">
            <p><strong>NOI:</strong> ${propertyMetrics.noi}</p>
            <p><strong>Value:</strong> ${propertyMetrics.value}</p>
            <p><strong>Leverage:</strong> {propertyMetrics.leverage * 100}%</p>
            <p><strong>DSCR:</strong> {propertyMetrics.dscr}</p>
          </div>
        ) : (
          <p>Loading property metrics...</p>
        )}
      </div>

      <style jsx>{`
        .scenario-map-container {
          padding: 20px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 30px;
        }

        h2 {
          margin-bottom: 20px;
          font-size: 24px;
        }

        .property-selector {
          margin-bottom: 20px;
        }

        .map-section {
          margin-bottom: 20px;
          height: 300px;
          background-color: #f0f0f0;
          border: 1px solid #ddd;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
        }

        .ai-insights-section {
          margin-bottom: 20px;
          background-color: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
        }

        .insights-text {
          white-space: pre-line;
          color: #333;
        }

        .metrics-section {
          background-color: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
        }

        .metrics-info p {
          font-size: 16px;
        }

        @media (max-width: 768px) {
          .scenario-map-container {
            padding: 10px;
          }

          h2 {
            font-size: 20px;
          }

          .map-section {
            height: 200px;
          }

          .metrics-info p {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default ScenarioMap;
