import React, { useState, useEffect } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface SearchResult {
  id: string;
  name: string;
  center: [number, number];
  place_name: string;
}

interface MapBoxSearchProps {
  onAddAddress: (address: string) => void;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const MapBoxSearch: React.FC<MapBoxSearchProps> = ({ onAddAddress }) => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [viewport, setViewport] = useState({
    latitude: 37.7749, // Default to San Francisco
    longitude: -122.4194,
    zoom: 10,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.length >= 3) {
        fetchSearchResults();
      } else {
        setResults([]); // Clear results if query is too short
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const fetchSearchResults = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/searchbox/v1/suggest?q=${encodeURIComponent(query)}&access_token=${MAPBOX_TOKEN}&limit=5`
      );
      const data = await response.json();
      setResults(data.suggestions || []);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleResultClick = (result: SearchResult) => {
    setSelectedResult(result);
    setViewport({
      latitude: result.center[1],
      longitude: result.center[0],
      zoom: 14,
    });
  };

  const handleAddAddress = () => {
    if (selectedResult) {
      onAddAddress(selectedResult.place_name);
      setSelectedResult(null); // Clear the selected result after adding
    }
  };

  return (
    <div className="mapbox-search">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search for an address or place"
        className="search-input"
      />
      {isLoading && <div className="loading-spinner">Loading...</div>}

      <div className="map-container">
        <Map
          {...viewport}
          style={{ width: '100%', height: '300px' }}
          mapStyle="mapbox://styles/mapbox/dark-v10"
          mapboxAccessToken={MAPBOX_TOKEN}
          onMove={(event) => setViewport(event.viewState)}
        >
          {results.map((result) => (
            <Marker
              key={result.id}
              latitude={result.center[1]}
              longitude={result.center[0]}
              onClick={() => handleResultClick(result)}
            >
              <div className="marker">📍</div>
            </Marker>
          ))}

          {selectedResult && (
            <Popup
              latitude={selectedResult.center[1]}
              longitude={selectedResult.center[0]}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setSelectedResult(null)}
              anchor="top"
            >
              <div className="popup-content">
                <p>{selectedResult.place_name}</p>
                <button onClick={handleAddAddress}>Add Address</button>
              </div>
            </Popup>
          )}
        </Map>
      </div>

      <style jsx>{`
        .mapbox-search {
          width: 100%;
          max-width: 100%;
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }

        .search-input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 16px;
        }

        .loading-spinner {
          text-align: center;
          font-size: 14px;
          color: #666;
        }

        .map-container {
          width: 100%;
          height: 100%;
          min-height: 300px;
          max-height: 600px;
          border-radius: 8px;
          overflow: hidden;
        }

        .marker {
          font-size: 24px;
          cursor: pointer;
        }

        .popup-content {
          text-align: center;
        }

        .popup-content button {
          background-color: #007bff;
          color: white;
          padding: 8px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .popup-content button:hover {
          background-color: #0056b3;
        }

        @media (max-width: 768px) {
          .map-container {
            height: 250px;
          }

          .search-input {
            font-size: 14px;
            padding: 8px;
          }

          .popup-content button {
            padding: 6px 10px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default MapBoxSearch;
