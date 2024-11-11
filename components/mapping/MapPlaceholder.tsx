import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface MapPlaceholderProps {
  propertyId: string;
  location: string; // Location as an address or coordinates
}

const MapPlaceholder: React.FC<MapPlaceholderProps> = ({ propertyId, location }) => {
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);

  // Access the Google Maps API key from the environment variable
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  useEffect(() => {
    // Fetch coordinates from location using Google Maps Geocoding API
    const fetchCoordinates = async () => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            location
          )}&key=${googleMapsApiKey}`
        );
        const data = await response.json();

        if (data.results && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          setCoordinates({ lat, lng });
        } else {
          console.error('No results found for the provided location.');
        }
      } catch (error) {
        console.error('Error fetching coordinates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoordinates();
  }, [location, googleMapsApiKey]);

  if (loading) {
    return <div>Loading map for {propertyId}...</div>;
  }

  if (!coordinates) {
    return <div>Could not fetch location coordinates.</div>;
  }

  return (
    <div className="map-container">
      <LoadScript googleMapsApiKey={googleMapsApiKey}>
        <GoogleMap
          mapContainerStyle={{
            width: '100%',
            height: '400px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
          center={coordinates}
          zoom={15}
        >
          <Marker position={coordinates} />
        </GoogleMap>
      </LoadScript>

      <style jsx>{`
        .map-container {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          margin-top: 20px;
        }

        @media (max-width: 768px) {
          .map-container {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default MapPlaceholder;
