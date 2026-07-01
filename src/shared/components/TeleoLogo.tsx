// shared/components/TeleoLogo.tsx — Reusable brand emblem SVG
// Fish + cross symbol contained in a circular chat-bubble silhouette

import React from 'react';

interface TeleoLogoProps {
  size?: number;
  className?: string;
}

const TeleoLogo: React.FC<TeleoLogoProps> = ({ size = 120, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Teleo logo"
      role="img"
    >
      {/* Outer circular arc — top-left 3/4 arc */}
      <path
        d="M 100 15
           A 85 85 0 1 1 15 100"
        stroke="#1B3252"
        strokeWidth="14"
        strokeLinecap="round"
        fill="none"
      />

      {/* Chat bubble tail — bottom-left pointing down-left */}
      <path
        d="M 15 100 Q 10 148 42 168"
        stroke="#1B3252"
        strokeWidth="14"
        strokeLinecap="round"
        fill="none"
      />

      {/* Fish body — Ichthys shape */}
      <path
        d="M 55 95
           C 62 72, 100 62, 130 78
           C 148 87, 158 98, 152 108
           C 148 120, 130 128, 110 126
           C 82 124, 60 116, 55 95 Z"
        fill="#1B3252"
      />

      {/* Fish tail — right side V-shape */}
      <path
        d="M 150 88 L 172 72 M 150 112 L 172 128"
        stroke="#1B3252"
        strokeWidth="9"
        strokeLinecap="round"
      />

      {/* Fish eye — small circle cutout */}
      <circle cx="82" cy="96" r="6" fill="white" />

      {/* Cross symbol — positioned top-right of fish */}
      {/* Vertical bar */}
      <rect x="126" y="54" width="10" height="34" rx="3" fill="#1B3252" />
      {/* Horizontal bar */}
      <rect x="116" y="64" width="30" height="10" rx="3" fill="#1B3252" />
    </svg>
  );
};

export default TeleoLogo;
