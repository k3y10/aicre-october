import React, { useState, useEffect } from 'react';
import Map, { Marker, Popup, Source, Layer, ViewStateChangeEvent } from 'react-map-gl';
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
  const [selectedLayers, setSelectedLayers] = useState<{ [key: string]: boolean }>({
    traffic: false,
    vacancies: false,
    population: false,
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

  const handleLayerToggle = (layer: string) => {
    setSelectedLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  const handleViewportChange = (event: ViewStateChangeEvent) => {
    setViewport(event.viewState);
  };

  return (
    <div className="heatmapPage">
      <h1>CRE Property Heatmap</h1>
      <div className="layer-controls">
        <label>
          <input
            type="checkbox"
            checked={selectedLayers.traffic}
            onChange={() => handleLayerToggle('traffic')}
          />
          Traffic Layer
        </label>
        <label>
          <input
            type="checkbox"
            checked={selectedLayers.vacancies}
            onChange={() => handleLayerToggle('vacancies')}
          />
          Vacancy Layer
        </label>
        <label>
          <input
            type="checkbox"
            checked={selectedLayers.population}
            onChange={() => handleLayerToggle('population')}
          />
          Population Trends
        </label>
      </div>

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

          {/* Traffic heatmap layer */}
          {selectedLayers.traffic && (
            <Source type="geojson" data="/data/traffic-data.geojson">
              <Layer
                id="traffic-layer"
                type="heatmap"
                paint={{
                  'heatmap-weight': 0.5,
                  'heatmap-intensity': 1.2,
                  'heatmap-color': [
                    'interpolate',
                    ['linear'],
                    ['heatmap-density'],
                    0, 'rgba(33, 102, 172, 0)',
                    0.5, 'rgba(103, 169, 207, 0.6)',
                    1, 'rgba(178, 24, 43, 1)',
                  ],
                }}
              />
            </Source>
          )}

          {/* Vacancy layer */}
          {selectedLayers.vacancies && (
            <Source type="geojson" data="/data/vacancy-data.geojson">
              <Layer
                id="vacancies-layer"
                type="fill"
                paint={{
                  'fill-color': 'rgba(255, 0, 0, 0.4)',
                  'fill-outline-color': 'rgba(255, 0, 0, 0.8)',
                }}
              />
            </Source>
          )}

          {/* Population trends layer */}
          {selectedLayers.population && (
            <Source type="geojson" data="/data/population-data.geojson">
              <Layer
                id="population-layer"
                type="circle"
                paint={{
                  'circle-radius': 8,
                  'circle-color': [
                    'step',
                    ['get', 'change_rate'],
                    'blue', -5,
                    'yellow', 0,
                    'green', 5,
                  ],
                  'circle-opacity': 0.6,
                }}
              />
            </Source>
          )}

          {/* Existing Popups and Markers */}
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

      <style jsx>{`
        .heatmapPage {
          padding: 20px;
        }

        .layer-controls {
          margin-bottom: 10px;
          display: flex;
          gap: 10px;
        }

        .layer-controls label {
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        .layer-controls input {
          margin-right: 5px;
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
      `}</style>
    </div>
  );
};

export default HeatMap;
