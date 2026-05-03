"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  APIProvider,
  Map,
  Marker,
  InfoWindow,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import { Navigation, MapPin, Clock, Car, Footprints, Bus, Loader2, X, LocateFixed } from 'lucide-react';
import { Button } from '@/components/ui/Button';

/* ─────────── Types ─────────── */
export interface PollingBooth {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  waitLevel: 'low' | 'medium' | 'high';
}

interface MapViewProps {
  booths?: PollingBooth[];
  className?: string;
  height?: string;
}

/* ─────────── Default booths (demo) ─────────── */
const DEFAULT_BOOTHS: PollingBooth[] = [
  { id: '1', name: 'KV No. 1, RK Puram', lat: 28.5634, lng: 77.1724, address: 'Sector 12, RK Puram, New Delhi', waitLevel: 'low' },
  { id: '2', name: 'Sarvodaya School', lat: 28.5712, lng: 77.1845, address: 'Sector 4, RK Puram, New Delhi', waitLevel: 'medium' },
  { id: '3', name: 'Community Center', lat: 28.5589, lng: 77.1656, address: 'Sector 9, RK Puram, New Delhi', waitLevel: 'high' },
  { id: '4', name: 'DPS Vasant Kunj', lat: 28.5276, lng: 77.1517, address: 'Vasant Kunj, New Delhi', waitLevel: 'low' },
  { id: '5', name: 'Govt School Mehrauli', lat: 28.5235, lng: 77.1835, address: 'Mehrauli, New Delhi', waitLevel: 'medium' },
];

const DEFAULT_CENTER = { lat: 28.5634, lng: 77.1724 };

/* ─────────── Skeleton Loader ─────────── */
function MapSkeleton() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center gap-4 rounded-2xl" role="status" aria-label="Loading map">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-blue-200 dark:border-blue-800 border-t-blue-500 animate-spin" />
        <MapPin className="w-6 h-6 text-blue-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 animate-pulse">Loading map…</p>
    </div>
  );
}

/* ─────────── Error State ─────────── */
function MapError({ message }: { message: string }) {
  return (
    <div className="w-full h-full bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-8 text-center rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700" role="alert">
      <MapPin className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
      <p className="text-gray-500 dark:text-gray-400 font-medium mb-2">Map Unavailable</p>
      <p className="text-xs text-gray-400 dark:text-gray-500 max-w-xs">{message}</p>
    </div>
  );
}

/* ─────────── Places Autocomplete ─────────── */
function PlacesAutocomplete({ onPlaceSelect }: { onPlaceSelect: (place: any) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const placesLib = useMapsLibrary('places');
  const [autocomplete, setAutocomplete] = useState<any>(null);

  useEffect(() => {
    if (!placesLib || !inputRef.current) return;
    const ac = new placesLib.Autocomplete(inputRef.current, {
      componentRestrictions: { country: 'in' },
      fields: ['geometry', 'formatted_address', 'name'],
    });
    ac.addListener('place_changed', () => {
      const place = ac.getPlace();
      if (place?.geometry?.location) onPlaceSelect(place);
    });
    setAutocomplete(ac);
    return () => { try { google.maps.event.clearInstanceListeners(ac); } catch {} };
  }, [placesLib, onPlaceSelect]);

  return (
    <div className="relative">
      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        placeholder="Search for a location…"
        aria-label="Search location"
        className="w-full pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
      />
    </div>
  );
}

/* ─────────── Travel mode string map ─────────── */
const TRAVEL_MODE_MAP: Record<string, string> = {
  DRIVING: 'DRIVING',
  WALKING: 'WALKING',
  TRANSIT: 'TRANSIT',
};

/* ─────────── Directions Panel ─────────── */
function DirectionsRenderer({
  origin,
  destination,
  travelMode,
  onRouteInfo,
}: {
  origin: { lat: number; lng: number } | null;
  destination: { lat: number; lng: number } | null;
  travelMode: 'DRIVING' | 'WALKING' | 'TRANSIT';
  onRouteInfo: (info: { distance: string; duration: string } | null) => void;
}) {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const rendererRef = useRef<any>(null);

  useEffect(() => {
    if (!routesLib || !map) return;
    if (!rendererRef.current) {
      rendererRef.current = new routesLib.DirectionsRenderer({
        map,
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: '#4f6cff',
          strokeWeight: 5,
          strokeOpacity: 0.8,
        },
      });
    }
    return () => {
      rendererRef.current?.setMap(null);
      rendererRef.current = null;
    };
  }, [routesLib, map]);

  useEffect(() => {
    if (!routesLib || !rendererRef.current || !origin || !destination) {
      try { rendererRef.current?.setDirections({ routes: [] }); } catch {}
      onRouteInfo(null);
      return;
    }

    const svc = new routesLib.DirectionsService();
    const resolvedMode = (typeof google !== 'undefined' && google.maps?.TravelMode)
      ? google.maps.TravelMode[travelMode]
      : travelMode;

    svc.route(
      { origin, destination, travelMode: resolvedMode as any, provideRouteAlternatives: false },
      (result: any, status: any) => {
        const okStatus = (typeof google !== 'undefined' && google.maps?.DirectionsStatus)
          ? google.maps.DirectionsStatus.OK
          : 'OK';
        if (status === okStatus && result) {
          rendererRef.current?.setDirections(result);
          const leg = result.routes[0]?.legs[0];
          if (leg) {
            onRouteInfo({
              distance: leg.distance?.text || '',
              duration: leg.duration?.text || '',
            });
          }
        } else {
          onRouteInfo(null);
        }
      }
    );
  }, [routesLib, origin, destination, travelMode, onRouteInfo]);

  return null;
}

/* ─────────── Main MapView Component ─────────── */
export default function MapView({ booths, className, height = '500px' }: MapViewProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  const allBooths = booths ?? DEFAULT_BOOTHS;

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedBooth, setSelectedBooth] = useState<PollingBooth | null>(null);
  const [directionTarget, setDirectionTarget] = useState<{ lat: number; lng: number } | null>(null);
  const [travelMode, setTravelMode] = useState<'DRIVING' | 'WALKING' | 'TRANSIT'>('DRIVING');
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [configApiKey, setConfigApiKey] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Resolve API key – prefer env, fallback to /api/config
  const effectiveApiKey = apiKey || configApiKey;

  useEffect(() => {
    if (apiKey && apiKey !== 'demo-maps-key' && apiKey !== 'your_restricted_maps_api_key') {
      setIsLoading(false);
      return;
    }
    fetch('/api/config')
      .then(r => r.json())
      .then(d => { if (d.apiKey) setConfigApiKey(d.apiKey); })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [apiKey]);

  // Get user location
  const locateUser = useCallback(() => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setIsLocating(false);
      },
      () => {
        setUserLocation(DEFAULT_CENTER);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  useEffect(() => { locateUser(); }, [locateUser]);

  const handleGetDirections = useCallback((booth: PollingBooth) => {
    setDirectionTarget({ lat: booth.lat, lng: booth.lng });
    setSelectedBooth(null);
  }, []);

  const clearDirections = useCallback(() => {
    setDirectionTarget(null);
    setRouteInfo(null);
  }, []);

  const handleRouteInfo = useCallback((info: { distance: string; duration: string } | null) => {
    setRouteInfo(info);
  }, []);

  const handlePlaceSelect = useCallback((place: any) => {
    if (place?.geometry?.location) {
      const loc = place.geometry.location;
      setUserLocation({
        lat: typeof loc.lat === 'function' ? loc.lat() : loc.lat,
        lng: typeof loc.lng === 'function' ? loc.lng() : loc.lng,
      });
    }
  }, []);

  const waitColors: Record<string, string> = {
    low: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
    medium: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
    high: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
  };

  if (isLoading) return <div style={{ height }}><MapSkeleton /></div>;
  if (!effectiveApiKey || effectiveApiKey === 'demo-maps-key' || effectiveApiKey === 'your_restricted_maps_api_key') {
    return <div style={{ height }}><MapError message="Google Maps API key not configured. Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables." /></div>;
  }

  return (
    <div className={`relative rounded-2xl overflow-hidden border dark:border-gray-800 ${className ?? ''}`} style={{ height }}>
      <APIProvider apiKey={effectiveApiKey} libraries={['places']}>
        {/* Search bar overlay */}
        <div className="absolute top-4 left-4 right-4 z-10 flex gap-2">
          <div className="flex-1 max-w-md">
            <PlacesAutocomplete onPlaceSelect={handlePlaceSelect} />
          </div>
          <button
            onClick={locateUser}
            disabled={isLocating}
            className="flex items-center justify-center w-10 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            aria-label="Center on my location"
            title="My Location"
          >
            {isLocating ? <Loader2 className="w-4 h-4 animate-spin text-blue-500" /> : <LocateFixed className="w-4 h-4 text-blue-500" />}
          </button>
        </div>

        {/* Travel mode selector */}
        {directionTarget && (
          <div className="absolute top-16 left-4 z-10 flex gap-1 bg-white dark:bg-gray-800 rounded-xl p-1 border border-gray-200 dark:border-gray-700 shadow-lg">
            {([
              { mode: 'DRIVING' as const, icon: Car, label: 'Drive' },
              { mode: 'WALKING' as const, icon: Footprints, label: 'Walk' },
              { mode: 'TRANSIT' as const, icon: Bus, label: 'Transit' },
            ]).map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => setTravelMode(mode)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  travelMode === mode
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                aria-label={`Travel by ${label}`}
                aria-pressed={travelMode === mode}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
            <button
              onClick={clearDirections}
              className="ml-1 p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg"
              aria-label="Clear directions"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Route info badge */}
        {routeInfo && (
          <div className="absolute bottom-4 left-4 z-10 bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700 shadow-lg" role="status" aria-live="polite">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{routeInfo.distance}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{routeInfo.duration}</span>
              </div>
            </div>
          </div>
        )}

        <Map
          defaultCenter={userLocation || DEFAULT_CENTER}
          defaultZoom={13}
          gestureHandling="greedy"
          disableDefaultUI={false}
          mapId="bf51a910020fa25a"
          className="w-full h-full"
        >
          <DirectionsRenderer
            origin={userLocation}
            destination={directionTarget}
            travelMode={travelMode}
            onRouteInfo={handleRouteInfo}
          />

          {/* User marker */}
          {userLocation && !directionTarget && (
            <Marker
              position={userLocation}
              title="Your Location"
              icon={{
                url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              }}
            />
          )}

          {/* Booth markers */}
          {!directionTarget && allBooths.map((booth) => (
            <Marker
              key={booth.id}
              position={{ lat: booth.lat, lng: booth.lng }}
              onClick={() => setSelectedBooth(booth)}
              title={booth.name}
              icon={waitColors[booth.waitLevel]}
            />
          ))}

          {/* Info window */}
          {selectedBooth && !directionTarget && (
            <InfoWindow
              position={{ lat: selectedBooth.lat, lng: selectedBooth.lng }}
              onCloseClick={() => setSelectedBooth(null)}
            >
              <div className="p-2 min-w-[240px] text-gray-900">
                <h4 className="font-bold text-sm mb-1">{selectedBooth.name}</h4>
                <p className="text-xs text-gray-500 mb-2">{selectedBooth.address}</p>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-2 h-2 rounded-full ${
                    selectedBooth.waitLevel === 'low' ? 'bg-green-500' :
                    selectedBooth.waitLevel === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <span className="text-[10px] font-bold uppercase tracking-wide">
                    {selectedBooth.waitLevel} Wait Time
                  </span>
                </div>
                <button
                  onClick={() => handleGetDirections(selectedBooth)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Get Directions
                </button>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
  );
}
