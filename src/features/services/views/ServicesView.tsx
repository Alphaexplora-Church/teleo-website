// features/dashboard/views/ServicesTab.tsx
// View: Services tab — 2×2 service grid with icon placeholders

import React from 'react';

// ── Service tile ──────────────────────────────────────────────
interface ServiceTileProps {
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

const ServiceTile: React.FC<ServiceTileProps> = ({ label, icon, badge }) => (
  <button
    type="button"
    className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white border border-gray-border/60 p-5 shadow-sm min-h-[110px] cursor-pointer transition-all hover:border-navy/30 hover:shadow-md active:scale-95 active:bg-navy/5 relative"
  >
    {badge && (
      <span className="absolute top-2.5 right-2.5 px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-600 text-[9px] font-bold uppercase tracking-wide leading-none">
        {badge}
      </span>
    )}
    <div className="w-11 h-11 rounded-xl bg-off-white flex items-center justify-center text-navy">
      {icon}
    </div>
    <span className="text-[13px] font-semibold text-navy text-center leading-tight">{label}</span>
  </button>
);

// ── Inline SVG icons ──────────────────────────────────────────
const ChurchIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2L2 7v13h20V7L12 2z" />
    <path d="M12 2v4M10 4h4" />
    <rect x="9" y="13" width="6" height="8" />
  </svg>
);

const GivingIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z" />
    <path d="M12 6v12M9 9h4.5a1.5 1.5 0 0 1 0 3H9a1.5 1.5 0 0 0 0 3H14" />
  </svg>
);

const VolunteerIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const CounselIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const GroupsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="5" r="3" />
    <circle cx="5" cy="12" r="3" />
    <circle cx="19" cy="12" r="3" />
    <circle cx="12" cy="19" r="3" />
  </svg>
);

const MissionsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

// ── Component ─────────────────────────────────────────────────
const ServicesView: React.FC = () => {
  return (
    <div className="flex flex-col gap-5 px-5 pt-5 pb-6">
      {/* Header */}
      <div className="flex flex-col gap-0.5">
        <h1 className="text-[22px] font-bold text-navy leading-tight">Services</h1>
        <p className="text-[13px] text-gray-placeholder">Explore what's available to you</p>
      </div>

      {/* 3-column grid */}
      <div className="grid grid-cols-3 gap-3">
        <ServiceTile label="Church Info" icon={<ChurchIcon />} />
        <ServiceTile label="Giving" icon={<GivingIcon />} badge="New" />
        <ServiceTile label="Volunteer" icon={<VolunteerIcon />} />
        <ServiceTile label="Counseling" icon={<CounselIcon />} />
        <ServiceTile label="Groups" icon={<GroupsIcon />} />
        <ServiceTile label="Missions" icon={<MissionsIcon />} />
      </div>

      {/* Placeholder info strip */}
      <div className="w-full rounded-2xl bg-white border border-gray-border/60 px-5 py-4 shadow-sm flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-off-white flex items-center justify-center text-navy shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-[14px] font-semibold text-navy">More services coming</span>
          <span className="text-[12px] text-gray-placeholder leading-relaxed">Additional ministries and tools will be added here as Teleo grows.</span>
        </div>
      </div>
    </div>
  );
};

export default ServicesView;
