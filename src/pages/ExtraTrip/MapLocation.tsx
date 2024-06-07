// Map.tsx

import React, { useEffect, useRef } from 'react';

interface MapProps {
  google: any; 
  zoom: number;
  locations: { lat: number; lng: number; label: string }[]; 
}

const MapLocation: React.FC<MapProps> = ({ google, zoom, locations }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (google && locations.length > 0) {
      const map = new google.maps.Map(mapRef.current!, {
        zoom: zoom,
        center: { lat: locations[0].lat, lng: locations[0].lng },
      });

      locations.forEach((locations) => {
        new google.maps.Marker({
          position: { lat: locations.lat, lng: locations.lng },
          map: map,
          title: locations.label,
        });
      });
    }
  }, [google, zoom, locations]);

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />;
};

export default MapLocation;
