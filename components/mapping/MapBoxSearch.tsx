import React, { useState, useEffect } from 'react';
import Map, { Marker, Popup, ViewState } from 'react-map-gl';
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

interface ViewportState extends ViewState {
  transitionDuration?: number;
}

const MapBoxSearch: React.FC<MapBoxSearchProps> = ({ onAddAddress }) => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [viewport, setViewport] = useState<ViewportState>({
    latitude: 39.99244320496018, // Default to the USA
    longitude: -101.80767764879192,
    zoom: 2,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 }, // Ensure padding is included
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.length >= 3) {
        fetchSearchResults();
      } else {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const fetchSearchResults = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch data from Mapbox API');
      }
      const data = await response.json();

      const mappedResults = data.features.map((feature: any) => ({
        id: feature.id,
        name: feature.text,
        center: feature.center,
        place_name: feature.place_name,
      }));

      setResults(mappedResults);
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
      ...viewport,
      latitude: result.center[1],
      longitude: result.center[0],
      zoom: 14,
      transitionDuration: 1000,
    });
    setResults([]); // Clear results after selection
    setQuery(result.place_name); // Update input field to show the selected place name
  };

  const handleAddAddress = () => {
    if (selectedResult) {
      onAddAddress(selectedResult.place_name);
      setSelectedResult(null);
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

      {results.length > 0 && (
        <div className="results-dropdown">
          {results.map((result) => (
            <div
              key={result.id}
              className="result-item"
              onClick={() => handleResultClick(result)}
            >
              {result.place_name}
            </div>
          ))}
        </div>
      )}

      <div className="map-container">
        <Map
          {...viewport}
          style={{ width: '100%', height: '600px' }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          mapboxAccessToken={MAPBOX_TOKEN}
          onMove={(event) => setViewport(event.viewState)}
        >
          {selectedResult && (
            <Marker
              latitude={selectedResult.center[1]}
              longitude={selectedResult.center[0]}
            >
              <div className="marker">📍</div>
            </Marker>
          )}

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
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-bottom: 20px;
        }

        .search-input {
          padding: 12px;
          border: 1px solid #dfe3e8;
          border-radius: 8px;
          font-size: 15px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          transition: border 0.3s, box-shadow 0.3s;
        }

        .search-input:focus {
          border-color: #4a90e2;
          box-shadow: 0 0 6px rgba(74, 144, 226, 0.5);
          outline: none;
        }

        .loading-spinner {
          text-align: center;
          font-size: 14px;
          color: #888;
        }

        .results-dropdown {
          background: white;
          border: 1px solid #dfe3e8;
          border-radius: 8px;
          max-height: 200px;
          overflow-y: auto;
        }

        .result-item {
          padding: 10px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .result-item:hover {
          background-color: #f0f0f0;
        }

        .map-container {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .marker {
          font-size: 20px;
          cursor: pointer;
          transform: translate(-50%, -50%);
        }

        .popup-content {
          text-align: center;
        }

        .popup-content button {
          background-color: #4a90e2;
          color: #fff;
          padding: 8px 14px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .popup-content button:hover {
          background-color: #357ab9;
        }
      `}</style>
    </div>
  );
};

export default MapBoxSearch;
