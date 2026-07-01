// shared/components/TeleoLogo.tsx — Reusable brand emblem SVG
// Fish + cross symbol contained in a circular chat-bubble silhouette

import React from 'react';
import teleoLogo from '../../assets/teleo_logo.svg';

interface TeleoLogoProps {
  size?: number;
  className?: string;
}

const TeleoLogo: React.FC<TeleoLogoProps> = ({ size = 120, className = '' }) => {
  return (
    <img
      src={teleoLogo}
      alt="Teleo Logo"
      width={size}
      height={size}
      className={className}
    />
  );
};

export default TeleoLogo;
