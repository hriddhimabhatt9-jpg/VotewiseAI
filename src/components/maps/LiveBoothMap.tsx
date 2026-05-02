"use client";

import React, { useState, useEffect } from 'react';
import { APIProvider, Map, Marker, InfoWindow, useMap } from '@vis.gl/react-google-maps';

interface Booth {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  waitLevel: 'low' | 'medium' | 'high';
}

const MOCK_BOOTHS: Booth[] = [
  { id: '1', name: 'KV No. 1, RK Puram', lat: 28.5634, lng: 77.1724, address: 'Sector 12, RK Puram, New Delhi', waitLevel: 'low' },
  { id: '2', name: 'Sarvodaya School', lat: 28.5712, lng: 77.1845, address: 'Sector 4, RK Puram, New Delhi', waitLevel: 'medium' },
  { id: '3', name: 'Community Center', lat: 28.5589, lng: 77.1656, address: 'Sector 9, RK Puram, New Delhi', waitLevel: 'high' },
];

export default function LiveBoothMap() {
  const [apiKey, setApiKey] = useState<string>(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '');
  const [selectedBooth, setSelectedBooth] = useState<Booth | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(!apiKey);

  useEffect(() => {
    async function fetchConfig() {
      if (apiKey) return;
      try {
        const res = await fetch('/api/config');
        const data = await res.json();
        if (data.apiKey) {
          setApiKey(data.apiKey);
        }
      } catch (err) {
        console.error('Failed to fetch map config:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchConfig();
  }, [apiKey]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Default to Delhi center if denied
          setUserLocation({ lat: 28.5634, lng: 77.1724 });
        }
      );
    }
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-full bg-gray-100 dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!apiKey) {
    return (
      <div className="w-full h-full bg-gray-100 dark:bg-gray-950 flex flex-col items-center justify-center p-8 text-center">
        <p className="text-gray-500 mb-4">Google Maps API key not found.</p>
        <div className="p-4 border-2 border-dashed border-gray-300 rounded-xl max-w-xs">
          <p className="text-xs text-gray-400">Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables to enable the live map.</p>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div className="w-full h-full rounded-2xl overflow-hidden border dark:border-gray-800">
        <Map
          defaultCenter={userLocation || { lat: 28.5634, lng: 77.1724 }}
          defaultZoom={14}
          gestureHandling={'greedy'}
          disableDefaultUI={false}
          mapId="bf51a910020fa25a" // Modern map style
          className="w-full h-full"
        >
          {userLocation && (
            <Marker
              position={userLocation}
              title="Your Location"
              label="You"
            />
          )}

          {MOCK_BOOTHS.map((booth) => (
            <Marker
              key={booth.id}
              position={{ lat: booth.lat, lng: booth.lng }}
              onClick={() => setSelectedBooth(booth)}
              title={booth.name}
              icon={
                booth.waitLevel === 'low' 
                  ? 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
                  : booth.waitLevel === 'medium'
                  ? 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
                  : 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
              }
            />
          ))}

          {selectedBooth && (
            <InfoWindow
              position={{ lat: selectedBooth.lat, lng: selectedBooth.lng }}
              onCloseClick={() => setSelectedBooth(null)}
            >
              <div className="p-2 min-w-[200px] text-gray-900">
                <h4 className="font-bold text-sm">{selectedBooth.name}</h4>
                <p className="text-xs text-gray-500 mb-2">{selectedBooth.address}</p>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    selectedBooth.waitLevel === 'low' ? 'bg-green-500' : 
                    selectedBooth.waitLevel === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <span className="text-[10px] font-bold uppercase">
                    {selectedBooth.waitLevel} Wait Time
                  </span>
                </div>
              </div>
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
}
