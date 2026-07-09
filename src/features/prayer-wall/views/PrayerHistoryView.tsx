import React from 'react';
import { usePrayerHistoryViewModel } from '../viewmodels/PrayerHistoryViewModel';

const PrayerHistoryView: React.FC = () => {
  const { prayers } = usePrayerHistoryViewModel();

  return (
    <section className="min-h-dvh bg-off-white px-5 py-8">
      <div className="mx-auto w-full max-w-[448px]">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#129e9a]">
          Prayer Wall
        </p>
        <h1 className="mt-2 text-[26px] font-black tracking-[-0.04em] text-navy">
          Prayer History
        </h1>

        <div className="mt-6 space-y-3">
          {prayers.map((prayer) => (
            <article
              key={prayer.id}
              className="rounded-2xl border border-gray-border/70 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="font-bold text-navy">{prayer.author}</p>
                <p className="text-[11px] text-gray-placeholder">{prayer.timeAgo}</p>
              </div>
              <p className="mt-3 text-[13px] leading-5 text-gray-label">
                {prayer.frontMessage}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PrayerHistoryView;
