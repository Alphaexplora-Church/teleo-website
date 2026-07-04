// features/register/views/Step5Location.tsx
// View: Step 5 — Interactive Leaflet map for location selection
// Layout: Top 60% map + bottom address card modal (mirrors image_174a59.png)

import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import type { LocationData } from '../models/registerTypes';

// ── Fix Leaflet default marker icons in Vite ──────────────────
// Vite's asset pipeline breaks Leaflet's internal _getIconUrl resolution.
// We patch it once here at module load time.
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// ── Custom navy marker icon to match Teleo brand ─────────────
const navyMarkerIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'teleo-map-marker',
});

// ── Default centre (Manila — replace with geolocation later) ─
const DEFAULT_CENTER: [number, number] = [14.5995, 120.9842];
const DEFAULT_ZOOM = 13;

// ── Nominatim reverse geocoder (free, no API key) ────────────
const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`,
      { headers: { 'Accept-Language': 'en' } }
    );
    if (!res.ok) return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    const data = await res.json();
    return (data.display_name as string) ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  } catch {
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }
};

// ── Draggable marker + click-to-place inner component ────────
interface DraggableMarkerProps {
  position: [number, number];
  onPositionChange: (lat: number, lng: number) => void;
}

const DraggableMarker: React.FC<DraggableMarkerProps> = ({ position, onPositionChange }) => {
  // Allow clicking anywhere on the map to reposition the marker
  useMapEvents({
    click(e) {
      onPositionChange(e.latlng.lat, e.latlng.lng);
    },
  });

  return (
    <Marker
      position={position}
      icon={navyMarkerIcon}
      draggable
      eventHandlers={{
        dragend(e) {
          const m = e.target as L.Marker;
          const ll = m.getLatLng();
          onPositionChange(ll.lat, ll.lng);
        },
      }}
    />
  );
};

// ── Location pin icon ─────────────────────────────────────────
const LocationPinIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

// ── Props ─────────────────────────────────────────────────────
interface Step5Props {
  currentLocation: LocationData | null;
  onSubmit: (location: LocationData) => void;
  onSkip: () => void;
}

// ── Component ─────────────────────────────────────────────────
const Step5Location: React.FC<Step5Props> = ({ currentLocation, onSubmit, onSkip }) => {
  const [markerPos, setMarkerPos] = useState<[number, number]>(
    currentLocation
      ? [currentLocation.lat, currentLocation.lng]
      : DEFAULT_CENTER
  );
  const [address, setAddress] = useState<string>(currentLocation?.address ?? '');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const geocodeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reverse geocode whenever marker moves (debounced 600ms)
  const handlePositionChange = (lat: number, lng: number) => {
    setMarkerPos([lat, lng]);
    setIsGeocoding(true);
    if (geocodeTimeout.current) clearTimeout(geocodeTimeout.current);
    geocodeTimeout.current = setTimeout(async () => {
      const resolved = await reverseGeocode(lat, lng);
      setAddress(resolved);
      setIsGeocoding(false);
    }, 600);
  };

  // Initial geocode for default centre (only if no pre-existing location)
  useEffect(() => {
    if (!currentLocation) {
      handlePositionChange(DEFAULT_CENTER[0], DEFAULT_CENTER[1]);
    }
    return () => {
      if (geocodeTimeout.current) clearTimeout(geocodeTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConfirm = () => {
    onSubmit({ address, lat: markerPos[0], lng: markerPos[1] });
  };

  return (
    <div className="flex flex-col w-full flex-1 animate-page-fade-in">

      {/* ── Map area (60% of container height) ── */}
      <div className="relative w-full rounded-2xl overflow-hidden mb-0 flex-[6]" style={{ minHeight: '240px' }}>
        <MapContainer
          center={markerPos}
          zoom={DEFAULT_ZOOM}
          style={{ width: '100%', height: '100%', minHeight: '240px', borderRadius: '1rem' }}
          scrollWheelZoom={false}
          zoomControl={false}
        >
          {/* OSM tile layer — free, no key required */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <DraggableMarker position={markerPos} onPositionChange={handlePositionChange} />
        </MapContainer>

        {/* Tap hint overlay (fades out on first interaction) */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[999] pointer-events-none">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm border border-gray-border/50 flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span className="text-[11px] text-gray-placeholder font-medium">Tap or drag the pin to set location</span>
          </div>
        </div>
      </div>

      {/* ── Address card (bottom 40%) ── */}
      <div className="flex-[4] flex flex-col pt-4 gap-4">

        {/* Address display */}
        <div className="w-full bg-white rounded-2xl border border-gray-border/60 shadow-sm px-4 py-3.5 flex items-start gap-3">
          <span className={`mt-0.5 shrink-0 ${isGeocoding ? 'text-gray-placeholder animate-pulse' : 'text-navy'}`}>
            <LocationPinIcon />
          </span>
          <div className="flex flex-col gap-0.5 min-w-0 flex-1">
            <span className="text-[11px] font-bold text-gray-placeholder uppercase tracking-wider">Selected Location</span>
            {isGeocoding ? (
              <div className="h-4 w-3/4 bg-gray-border/60 rounded animate-pulse mt-1" />
            ) : (
              <p className="text-[13px] text-navy font-medium leading-snug">{address || 'Locating…'}</p>
            )}
          </div>
        </div>

        {/* Coordinates display (small, informational) */}
        <p className="text-[11px] text-gray-placeholder text-center font-mono">
          {markerPos[0].toFixed(5)}°, {markerPos[1].toFixed(5)}°
        </p>

        {/* Action buttons */}
        <div className="flex flex-col gap-3 mt-auto">
          <button
            id="btn-reg-step5-submit"
            type="button"
            onClick={handleConfirm}
            disabled={true}
            className="w-full min-h-[52px] flex items-center justify-center gap-2.5 rounded-full border-none bg-navy text-white font-sans text-[15px] font-semibold tracking-[0.1px] cursor-pointer px-6 transition-all shadow-btn hover:bg-navy-hover hover:shadow-[0_4px_16px_rgba(27,50,82,0.28)] active:bg-navy-active active:scale-95 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed select-none"
          >
            {isGeocoding ? (
              <span className="inline-block w-5 h-5 border-[2.5px] border-white/40 border-t-white rounded-full animate-spin" aria-label="Resolving address" />
            ) : (
              'Choose this location'
            )}
          </button>

          <button
            id="btn-reg-step5-skip"
            type="button"
            onClick={onSkip}
            className="w-full min-h-[52px] flex items-center justify-center gap-2 rounded-full border-[1.5px] border-gray-border bg-transparent text-gray-placeholder font-sans text-[15px] font-medium cursor-pointer px-6 transition-all hover:border-navy hover:text-navy hover:bg-navy/5 active:scale-95 active:bg-navy/10 select-none"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step5Location;
