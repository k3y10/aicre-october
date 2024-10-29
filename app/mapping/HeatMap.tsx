import React, { useState, useEffect } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { generateCREInsights } from '@/utilities/aiUtils'; // Import the generateCREInsights function

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
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [propertyType, setPropertyType] = useState<string>('all');
  const [viewport, setViewport] = useState({
    latitude: 40.7143, // Centered on Salt Lake City (default)
    longitude: -111.8548,
    zoom: 14,
  });
  const [insights, setInsights] = useState<string | null>(null); // For displaying insights
  const [loadingInsights, setLoadingInsights] = useState<boolean>(false); // Loading state for insights

  useEffect(() => {
    // Fetch property data based on selected property type
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
  
    // Set loading state to true while insights are being generated
    setLoadingInsights(true);
    setInsights(null); // Clear previous insights
  
    // Provide a default value for ownershipPercentage if it's undefined
    const propertyWithOwnership = {
      ...property,
      ownershipPercentage: property.ownershipPercentage ?? 100,  // Default to 100% if not provided
    };
  
    // Call the generateCREInsights function with the selected property
    const generatedInsights = await generateCREInsights([propertyWithOwnership]);
  
    // Set the insights and turn off the loading state
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
      <div style={{ height: '500px' }}>
        <Map
          initialViewState={viewport}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxAccessToken={MAPBOX_TOKEN}
        >
          {/* Plot property locations as markers */}
          {properties.map((property) => (
            <Marker
              key={property.propertyId}  // Use propertyId as the unique key
              latitude={property.latitude}
              longitude={property.longitude}
              onClick={() => handlePropertyClick(property)}
            >
              <div
                style={{
                  backgroundColor: getColorForProperty(property.noi),
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                }}
              ></div>
            </Marker>
          ))}

          {/* Display Popup for the selected property */}
          {selectedProperty && (
            <Popup
              latitude={selectedProperty.latitude}
              longitude={selectedProperty.longitude}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setSelectedProperty(null)}
              anchor="top"
            >
              <div>
                <h4>{selectedProperty.propertyName}</h4>
                <p>NOI: ${selectedProperty.noi.toLocaleString()}</p>
                <p>Value: ${selectedProperty.value.toLocaleString()}</p>
                <p>DSCR: {selectedProperty.dscr}</p>
                <p>Leverage: {(selectedProperty.leverage * 100).toFixed(2)}%</p>
                <img
                  src={selectedProperty.image}
                  alt={selectedProperty.propertyName}
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
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
