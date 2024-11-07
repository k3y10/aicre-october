import React, { useState, useEffect } from 'react';
import Map, { Marker, Popup, ViewStateChangeEvent } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { generateCREInsights } from '@/utilities/aiText';

interface Tenant {
  id: string;
  propertyId: string;
  propertyName: string;
  type: string;
  address: string;
  noi: number;
  value: number;
  leverage: number;
  yieldRate: number;
  dscr: number;
  opportunity: string;
  image: string;
  latitude: number;
  longitude: number;
  location?: string;
  ownershipPercentage?: number;
}

interface Property {
  id: string;
  propertyId: string;
  propertyName: string;
  type: string;
  address: string;
  noi: number;
  value: number;
  leverage: number;
  yieldRate: number;
  dscr: number;
  opportunity: string;
  image: string;
  latitude: number;
  longitude: number;
  location?: string;
  ownershipPercentage?: number;
  tenants?: Tenant[];
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const mapToPropertyInfo = (property: Property | Tenant): Property & { location: string; ownershipPercentage: number } => ({
  ...property,
  location: property.location || 'Unknown location',
  ownershipPercentage: property.ownershipPercentage ?? 100,
});

const HeatMap: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [hoveredProperty, setHoveredProperty] = useState<Tenant | Property | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Tenant | Property | null>(null);
  const [insights, setInsights] = useState<string | null>(null);
  const [loadingInsights, setLoadingInsights] = useState<boolean>(false);
  const [viewport, setViewport] = useState({
    latitude: 47.78097617278332,
    longitude: -103.81320935023722,
    zoom: 2,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const brickyardResponse = await fetch('/property_types/brickyardplaza.json');
        const portolaResponse = await fetch('/property_types/portolaplaza.json');

        const brickyardData: Property = await brickyardResponse.json();
        const portolaData: Property = await portolaResponse.json();

        setProperties([brickyardData, portolaData]);
      } catch (error) {
        console.error('Error loading property data:', error);
      }
    };

    loadData();
  }, []);

  const getColorForType = (type: string) => {
    switch (type) {
      case 'Commercial': return 'blue';
      case 'Recreational': return 'orange';
      case 'Residential': return 'purple';
      case 'Retail': return 'red';
      default: return 'gray';
    }
  };

  const handlePropertyClick = async (property: Tenant | Property) => {
    const propertyInfo = mapToPropertyInfo(property);
    setSelectedProperty(propertyInfo);
    setLoadingInsights(true);
    setInsights(null);

    const generatedInsights = await generateCREInsights([propertyInfo]);
    setInsights(generatedInsights);
    setLoadingInsights(false);
  };

  const handleViewportChange = (event: ViewStateChangeEvent) => {
    setViewport(event.viewState);
  };

  return (
    <div className="heatmapPage">
      <h1>CRE Property Heatmap</h1>

      <div className="map-container">
        <Map
          {...viewport}
          style={{ width: '100%', height: '600px' }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          mapboxAccessToken={MAPBOX_TOKEN}
          onMove={handleViewportChange}
        >
          {properties.map((property) => (
            <Marker
              key={property.id}
              latitude={property.latitude}
              longitude={property.longitude}
              onClick={() => handlePropertyClick(property)}
            >
              <div
                className="marker main-property-marker"
                style={{ backgroundColor: getColorForType(property.type) }}
                onMouseEnter={() => setHoveredProperty(property)}
                onMouseLeave={() => setHoveredProperty(null)}
              >
                {property.propertyName}
              </div>
            </Marker>
          ))}

          {viewport.zoom >= 13 && properties.flatMap((property) => property.tenants || []).map((tenant) => (
            <Marker
              key={tenant.id}
              latitude={tenant.latitude}
              longitude={tenant.longitude}
              onClick={() => handlePropertyClick(tenant)}
            >
              <div
                className="marker tenant-marker"
                style={{ backgroundColor: getColorForType(tenant.type) }}
                onMouseEnter={() => setHoveredProperty(tenant)}
                onMouseLeave={() => setHoveredProperty(null)}
              >
                {tenant.propertyName}
              </div>
            </Marker>
          ))}

          {hoveredProperty && (
            <Popup
              latitude={hoveredProperty.latitude}
              longitude={hoveredProperty.longitude}
              closeButton={false}
              anchor="top"
            >
              <div className="popup-container">
                <h4>{hoveredProperty.propertyName}</h4>
                <p>NOI: ${hoveredProperty.noi.toLocaleString()}</p>
                <p>Value: ${hoveredProperty.value.toLocaleString()}</p>
                <p>DSCR: {hoveredProperty.dscr}</p>
                <p>Leverage: {(hoveredProperty.leverage * 100).toFixed(2)}%</p>
              </div>
            </Popup>
          )}

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
              </div>
            </Popup>
          )}
        </Map>
      </div>

      {/* Insights Box */}
      <div className="insights-box">
        <h3>Insights</h3>
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

        .map-container {
          height: 600px;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        }

        .marker {
          cursor: pointer;
          border-radius: 50%;
          padding: 4px 8px;
          color: white;
          font-size: 12px;
          font-weight: bold;
          text-align: center;
        }

        .main-property-marker {
          background-color: black;
        }

        .tenant-marker {
          opacity: 0.8;
        }

        .popup-container {
          display: flex;
          flex-direction: column;
          text-align: center;
          color: white;
        }

        .insights-box {
          margin-top: 20px;
          padding: 15px;
          background-color: #333;
          color: white;
          border-radius: 6px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }

        .insights-box h3 {
          margin-bottom: 10px;
        }

        .loading-spinner {
          display: flex;
          align-items: center;
        }

        .spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
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

        h1 {
          text-align: center;
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
};

export default HeatMap;
