// features/profile/views/HistoryView.tsx
// View layer — static page for History feature.
// Dumb UI following Teleo branding guidelines.

import React from 'react';

const HistoryView: React.FC = () => {
  return (
    <main className="flex flex-col w-full items-center gap-6 relative min-h-full pt-6 pb-10 font-roboto bg-white text-black">
      <div className="flex flex-col w-full gap-5 px-5 max-w-105">
        {/* ── Hero Title ─────────────────────────────────────────── */}
        <section className="flex flex-col gap-1 w-full">
          <h1 className="text-black text-2xl font-bold font-sans leading-6">
            History
          </h1>
          <p className="text-black/50 text-xs font-normal font-sans leading-4">
            Your activity and interaction history.
          </p>
        </section>

        {/* ── Coming Soon Container ───────────────────────────────── */}
        <div className="w-full p-8 bg-[#336ef90d] rounded-[20px] border border-[#1f2156] flex flex-col items-center justify-center gap-3 text-center min-h-[220px]">
          <div className="size-12 rounded-full bg-[#1f2156]/10 flex items-center justify-center text-[#1f2156]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <h2 className="text-[#1f2156] text-lg font-bold font-sans leading-6">
            History feature is coming soon
          </h2>
          <p className="text-black/60 text-sm font-normal font-sans leading-5 max-w-[280px]">
            We are working on bringing your activity history here. Stay tuned for future updates!
          </p>
        </div>
      </div>
    </main>
  );
};

export default HistoryView;
