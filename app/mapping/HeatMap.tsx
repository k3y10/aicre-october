import React, { useState, useEffect } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { generateCREInsights } from '@/utilities/aiText'; // Import the generateCREInsights function

interface Property {
  propertyId: string;
  propertyName: string;
  noi: number;
  value: number;
  dscr: number;
  leverage: number;
  location: string;
  latitude: number;
  longitude: number;
  image: string;
  ownershipPercentage?: number;
}

const propertyTypes = ['all', 'commercial', 'residential', 'recreational', 'retail'];

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const HeatMap: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [hoveredProperty, setHoveredProperty] = useState<Property | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [propertyType, setPropertyType] = useState<string>('all');
  const [viewport, setViewport] = useState({
    latitude: 40.70211655777864, // Centered on Salt Lake City (default)
    longitude: -111.85822203254806,
    zoom: 15,
  });
  const [insights, setInsights] = useState<string | null>(null); // For displaying insights
  const [loadingInsights, setLoadingInsights] = useState<boolean>(false); // Loading state for insights

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/property_types/${propertyType}.json`);
        const data: Property[] = await response.json();
        setProperties(data);
      } catch (error) {
        console.error('Error loading property data:', error);
      }
    };
    fetchData();
  }, [propertyType]);

  const getColorForProperty = (noi: number) => {
    if (noi > 80000) {
      return 'green'; // High NOI
    } else if (noi < 50000) {
      return 'red'; // Low NOI
    } else {
      return '#f1c40f'; // Medium NOI
    }
  };

  const handlePropertyClick = async (property: Property) => {
    setSelectedProperty(property);
    setLoadingInsights(true);
    setInsights(null); // Clear previous insights

    const propertyWithOwnership = {
      ...property,
      ownershipPercentage: property.ownershipPercentage ?? 100, // Default to 100% if not provided
    };

    const generatedInsights = await generateCREInsights([propertyWithOwnership]);

    setInsights(generatedInsights);
    setLoadingInsights(false);
  };

  const handlePropertyTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPropertyType(e.target.value);
  };

  return (
    <div className="heatmapPage">
      <h1>CRE Property Heatmap</h1>

      {/* Dropdown to select the property type */}
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
      </div>

      {/* Mapbox map */}
      <div className="map-container">
        <Map
          initialViewState={viewport}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/dark-v10" // Use a more visually appealing style
          mapboxAccessToken={MAPBOX_TOKEN}
        >
          {/* Plot property locations as markers */}
          {properties.map((property) => (
            <Marker
              key={property.propertyId}  // Use propertyId as the unique key
              latitude={property.latitude}
              longitude={property.longitude}
              onClick={() => handlePropertyClick(property)} // Fire AI insights on click
            >
              <div
                className="hexagon"
                style={{
                  backgroundColor: getColorForProperty(property.noi),
                }}
                onMouseEnter={() => setHoveredProperty(property)}  // Show basic info on hover
                onMouseLeave={() => setHoveredProperty(null)}
              >
                ${Math.round(property.noi / 1000)}K
              </div>
            </Marker>
          ))}

          {/* Display Popup when hovering over a property */}
          {hoveredProperty && (
            <Popup
              latitude={hoveredProperty.latitude}
              longitude={hoveredProperty.longitude}
              closeButton={false}  // Disable close button since it's hover-based
              anchor="top"
            >
              <div className="popup-container">
                <h4>{hoveredProperty.propertyName}</h4>
                <p>NOI: ${hoveredProperty.noi.toLocaleString()}</p>
                <p>Value: ${hoveredProperty.value.toLocaleString()}</p>
                <p>DSCR: {hoveredProperty.dscr}</p>
                <p>Leverage: {(hoveredProperty.leverage * 100).toFixed(2)}%</p>
                <img
                  src={hoveredProperty.image}
                  alt={hoveredProperty.propertyName}
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                />
              </div>
            </Popup>
          )}

          {/* Display Popup for the selected property (AI insights) */}
          {selectedProperty && insights && (
            <Popup
              latitude={selectedProperty.latitude}
              longitude={selectedProperty.longitude}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setSelectedProperty(null)}
              anchor="top"
            >
              <div className="popup-container">
                <h4>{selectedProperty.propertyName}</h4>
                <p>NOI: ${selectedProperty.noi.toLocaleString()}</p>
                <p>Value: ${selectedProperty.value.toLocaleString()}</p>
                <p>DSCR: {selectedProperty.dscr}</p>
                <p>Leverage: {(selectedProperty.leverage * 100).toFixed(2)}%</p>
                <p>{insights}</p>
              </div>
            </Popup>
          )}
        </Map>
      </div>

      {/* Insights Section */}
      <div className="insightsSection">
        <h3>Insights and Recommendations</h3>
        {loadingInsights ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Generating insights...</p>
          </div>
        ) : (
          <p>{insights || 'Click on a property to generate insights.'}</p>
        )}
      </div>

      <style jsx>{`
        .heatmapPage {
          padding: 20px;
        }

        h1 {
          text-align: center;
          margin-bottom: 20px;
        }

        .selectors {
          margin-bottom: 20px;
          text-align: center;
        }

        select {
          margin-left: 10px;
          padding: 8px;
          border-radius: 5px;
          border: 1px solid #ddd;
        }

        .map-container {
          height: 600px; /* Increase map height */
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .hexagon {
          position: relative;
          width: 30px;
          height: 17.32px; /* Based on a 30px wide hexagon */
          background-color: #64C7CC;
          margin: 8.66px 0; /* To center the hexagon vertically */
          cursor: pointer;
          border-left: 2px solid white;
          border-right: 2px solid white;
          transform: rotate(90deg); /* Align hexagons to be flat-topped */
        }

        .hexagon::before,
        .hexagon::after {
          content: '';
          position: absolute;
          width: 0;
          border-left: 15px solid transparent;
          border-right: 15px solid transparent;
        }

        .hexagon::before {
          bottom: 100%;
          border-bottom: 8.66px solid #64C7CC;
        }

        .hexagon::after {
          top: 100%;
          width: 0;
          border-top: 8.66px solid #64C7CC;
        }

        .popup-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .popup-container h4 {
          margin: 0;
        }

        .insightsSection {
          margin-top: 20px;
          padding: 15px;
          background-color: #f9f9f9;
          border-radius: 6px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }

        .insightsSection h3 {
          margin-bottom: 10px;
          font-size: 18px;
        }

        .insightsSection p {
          font-size: 14px;
        }

        .loading-spinner {
          display: flex;
          align-items: center;
        }

        .spinner {
          border: 4px solid #f3f3f3; /* Light grey */
          border-top: 4px solid #3498db; /* Blue */
          border-radius: 50%;
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
          margin-right: 10px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default HeatMap;
