// features/register/views/Step5Location.tsx
// View: Step 5 — Location entry (text input only; map integration deferred to next phase)

import React, { useState } from 'react';
import type { LocationData } from '../models/registerTypes';

// ── Location pin icon ──────────────────────────────────────────
const LocationPinIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
  const [address, setAddress] = useState(currentLocation?.address ?? '');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!address.trim()) {
      setError('Please enter your address or tap Skip.');
      return;
    }
    setError('');
    onSubmit({ address: address.trim() });
  };

  return (
    <div className="flex flex-col gap-0 w-full animate-page-fade-in">
      {/* ── Header ── */}
      <div className="flex flex-col gap-2 mb-6">
        <h2 className="text-[24px] font-bold text-navy leading-tight">Where are you located?</h2>
        <p className="text-[14px] text-gray-placeholder leading-relaxed">
          Help us connect you with ministries and events near you.
        </p>
      </div>

      {/* ── Map placeholder ── */}
      <div className="w-full rounded-2xl overflow-hidden mb-5 border border-gray-border bg-[#e8ecef] relative" style={{ height: '220px' }}>
        {/* Static placeholder tile mimicking a map area */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-[#dce3ea] to-[#c8d2db]">
          {/* Grid lines to suggest a map */}
          <svg width="100%" height="100%" className="absolute inset-0 opacity-20" aria-hidden="true">
            {Array.from({ length: 8 }).map((_, i) => (
              <line key={`h${i}`} x1="0" y1={`${(i + 1) * 12.5}%`} x2="100%" y2={`${(i + 1) * 12.5}%`} stroke="#6b7280" strokeWidth="0.5" />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={`v${i}`} x1={`${(i + 1) * 10}%`} y1="0" x2={`${(i + 1) * 10}%`} y2="100%" stroke="#6b7280" strokeWidth="0.5" />
            ))}
          </svg>
          {/* Map coming soon notice */}
          <div className="relative z-10 flex flex-col items-center gap-2 bg-white/80 backdrop-blur-sm rounded-xl px-5 py-3 shadow-sm border border-white/60">
            <span className="text-navy text-sm font-semibold">Interactive map coming soon</span>
            <span className="text-gray-placeholder text-xs text-center leading-relaxed">Enter your address below to set your location</span>
          </div>
        </div>
      </div>

      {/* ── Address Input ── */}
      <div className="flex flex-col gap-1.5 mb-6">
        <label htmlFor="reg-location-address" className="text-sm font-medium text-gray-label tracking-[0.03px]">
          Address
        </label>
        <div className="relative flex items-center">
          <span className="absolute left-3.5 text-gray-placeholder pointer-events-none">
            <LocationPinIcon />
          </span>
          <input
            id="reg-location-address"
            type="text"
            placeholder="e.g. 452 Main Street, Detroit, MI"
            value={address}
            onChange={(e) => { setAddress(e.target.value); if (error) setError(''); }}
            autoComplete="street-address"
            className={`w-full min-h-[52px] pl-11 pr-3.5 rounded-[10px] border-[1.5px] font-sans text-[15px] text-gray-label bg-white outline-none transition-all
              ${error
                ? 'border-error focus:border-error focus:shadow-[0_0_0_3px_rgba(220,38,38,0.10)]'
                : 'border-gray-border focus:border-navy focus:shadow-[0_0_0_3px_rgba(27,50,82,0.10)]'
              }`}
          />
        </div>
        {error && <p className="text-xs text-error font-medium">{error}</p>}
      </div>

      {/* ── Action buttons ── */}
      <div className="flex flex-col gap-3">
        <button
          id="btn-reg-step5-submit"
          type="button"
          onClick={handleSubmit}
          className="w-full min-h-[52px] flex items-center justify-center gap-2.5 rounded-full border-none bg-navy text-white font-sans text-[15px] font-semibold tracking-[0.1px] cursor-pointer px-6 transition-all shadow-btn hover:bg-navy-hover hover:shadow-[0_4px_16px_rgba(27,50,82,0.28)] active:bg-navy-active active:scale-95 active:shadow-none select-none"
        >
          Choose this location
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
  );
};

export default Step5Location;
