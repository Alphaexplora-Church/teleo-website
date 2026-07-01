// features/dashboard/views/GuestDashboard.tsx
// Placeholder — authenticated / guest workspace landing

import React from 'react';
import { useNavigate } from 'react-router-dom';
import TeleoLogo from '../../../shared/components/TeleoLogo';

const GuestDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-[448px] min-h-dvh bg-white flex flex-col relative ring-1 ring-black/4 shadow-card">
      <div className="flex-1 flex flex-col items-center justify-center py-12 px-7 gap-3 animate-page-fade-in">
        <TeleoLogo size={80} />
        <h2 className="text-[22px] font-bold text-navy">Dashboard</h2>
        <p className="text-sm text-gray-placeholder">You're in. Dashboard coming soon.</p>
        <button
          type="button"
          className="w-full min-h-[52px] flex items-center justify-center rounded-full border-[1.5px] border-navy bg-transparent text-navy font-sans text-[15px] font-medium tracking-[0.1px] cursor-pointer px-6 transition-all hover:bg-navy/5 active:scale-95 active:bg-navy/10 select-none mt-6"
          onClick={() => navigate('/welcome')}
        >
          Back to Welcome
        </button>
      </div>
    </div>
  );
};

export default GuestDashboard;
