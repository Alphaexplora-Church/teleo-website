// features/dashboard/views/GuestDashboard.tsx
// Placeholder — authenticated / guest workspace landing

import React from 'react';
import { useNavigate } from 'react-router-dom';
import TeleoLogo from '../../../shared/components/TeleoLogo';

const GuestDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="teleo-shell">
      <div className="placeholder-container">
        <TeleoLogo size={80} />
        <h2 className="placeholder-title">Dashboard</h2>
        <p className="placeholder-subtitle">You're in. Dashboard coming soon.</p>
        <button
          type="button"
          className="btn-outline"
          style={{ marginTop: '24px' }}
          onClick={() => navigate('/welcome')}
        >
          Back to Welcome
        </button>
      </div>
    </div>
  );
};

export default GuestDashboard;
