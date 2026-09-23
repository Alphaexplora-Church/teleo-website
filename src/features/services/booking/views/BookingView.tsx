// features/services/booking/views/BookingView.tsx
// View layer: Service Overview & Requirements screen.
// Dumb UI only. Calls useBookingViewModel and renders.

import React from 'react';
import { useBookingViewModel } from '../viewModels/useBookingViewModel';

// ── Icons ────────────────────────────────────────────────────────────────────

const ClockIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const UsersIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

// ── View Props ───────────────────────────────────────────────────────────────

export interface BookingViewProps {
  /** Selected service name (e.g. "Baptism", "House Blessing", "Counseling")*/
  serviceName?: string;
  /** Selected church name (e.g. "St. Jude's Cathedral")*/
  churchName?: string;
  /** Callback triggered when user clicks proceed to schedule. */
  onProceedToSchedule?: () => void;
}

// ── BookingView Component ────────────────────────────────────────────────────

const BookingView: React.FC<BookingViewProps> = ({
  serviceName,
  churchName,
  onProceedToSchedule,
}) => {
  const { serviceDetails, churchTitle, handleProceedToSchedule } =
    useBookingViewModel({
      serviceName,
      churchName,
      onProceedToSchedule,
    });

  return (
    <main className="w-full bg-neutral-50 flex flex-col items-center gap-5 px-5 pt-4 pb-4 overflow-x-hidden">
      {/* ── Service Banner Image ──────────────────────────────────── */}
      <section className="w-full relative rounded-2xl shadow-sm flex flex-col justify-end overflow-hidden h-48 sm:h-52">
        <img
          src={serviceDetails.bannerUrl}
          alt={serviceDetails.name}
          className="w-full h-full object-cover absolute inset-0"
        />
        <div
          className="w-full h-full absolute inset-0 bg-[#1f2156]/70"
          aria-hidden="true"
        />
        <div className="relative z-10 p-5 flex flex-col gap-1">
          <p className="text-white/80 text-xs font-normal font-['Roboto'] uppercase tracking-wider">
            {churchTitle}
          </p>
          <h1 className="text-white text-2xl sm:text-3xl font-bold font-['Poppins'] leading-tight">
            {serviceDetails.name}
          </h1>
        </div>
      </section>

      {/* ── Service Overview ─────────────────────────────────────── */}
      <section className="w-full flex flex-col gap-3">
        <h2 className="text-black text-xl font-bold font-['Poppins'] leading-6">
          Service Overview
        </h2>
        <p className="text-black/70 text-sm font-normal font-['Roboto'] leading-6">
          {serviceDetails.overview}
        </p>

        {/* Badges: Duration + Max Guests */}
        <div className="inline-flex flex-wrap items-center gap-3 pt-1">
          <div className="px-3 py-1.5 bg-zinc-200/60 rounded-lg inline-flex items-center gap-2 text-zinc-800 text-xs font-medium font-['Roboto']">
            <ClockIcon />
            <span>{serviceDetails.duration}</span>
          </div>
          <div className="px-3 py-1.5 bg-zinc-200/60 rounded-lg inline-flex items-center gap-2 text-zinc-800 text-xs font-medium font-['Roboto']">
            <UsersIcon />
            <span>{serviceDetails.maxGuests}</span>
          </div>
        </div>
      </section>

      {/* ── Requirements Card ────────────────────────────────────── */}
      <section className="w-full p-4 bg-zinc-100 rounded-xl border border-neutral-200 flex flex-col gap-3">
        <p className="text-black/60 text-xs font-bold font-['Poppins'] uppercase tracking-wide">
          REQUIREMENTS
        </p>
        <div className="flex flex-col gap-2.5">
          {serviceDetails.requirements.map((req, index) => (
            <div key={index} className="inline-flex items-center gap-2.5">
              <span className="size-2 rounded-full bg-[#336ef9] shrink-0" aria-hidden="true" />
              <span className="text-black text-sm font-normal font-['Roboto'] leading-5">
                {req}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Proceed to Schedule CTA Button ───────────────────────── */}
      <section className="w-full">
        <button
          type="button"
          id="btn-proceed-to-schedule"
          onClick={handleProceedToSchedule}
          className="w-full py-3.5 bg-[#1f2156] hover:bg-[#2c2f6d] active:scale-[0.98] rounded-xl flex justify-center items-center transition-all duration-200 shadow-md text-white text-base font-bold font-['Poppins'] cursor-pointer"
        >
          Schedule Booking
        </button>
      </section>
    </main>
  );
};

export default BookingView;
