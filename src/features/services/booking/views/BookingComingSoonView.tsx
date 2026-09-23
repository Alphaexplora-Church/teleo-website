// features/services/booking-schedule/views/BookingComingSoonView.tsx
// View: "Feature Coming Soon" placeholder screen for service booking.
// Dumb presentational UI - follows Teleo brand guidelines.

import React from 'react';

// ── Decorative Calendar / Clock Icon ──────────────────────────
const CalendarSparkleIcon: React.FC = () => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#1f2156"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <path d="M12 14l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" fill="#336ef9" stroke="none" />
  </svg>
);

export interface BookingComingSoonViewProps {
  /** Triggered when user taps "Back to Services" button. */
  onBackToServices?: () => void;
}

const BookingComingSoonView: React.FC<BookingComingSoonViewProps> = ({
  onBackToServices,
}) => {
  return (
    <main className="w-full min-h-[75vh] flex flex-col items-center justify-center px-6 py-12 text-center gap-6">
      {/* Icon Container */}
      <div className="w-28 h-28 rounded-3xl bg-[#1f2156]/5 border border-[#1f2156]/10 flex items-center justify-center shadow-sm">
        <CalendarSparkleIcon />
      </div>

      {/* Heading & Subtitle */}
      <div className="flex flex-col gap-2 max-w-xs">
        <span className="inline-self-center px-3.5 py-1 rounded-full bg-[#336ef9]/10 text-[#336ef9] text-[11px] font-bold font-['Poppins'] tracking-wider uppercase self-center mb-1">
          Feature Coming Soon
        </span>
        <h1 className="text-2xl font-bold text-black font-['Poppins'] leading-snug">
          Online Booking In Development
        </h1>
        <p className="text-sm font-normal text-black/60 font-['Roboto'] leading-relaxed">
          We are finalizing instant calendar reservations and digital confirmations for church services. Stay tuned for updates!
        </p>
      </div>

      {/* Action Button */}
      <div className="w-full max-w-xs pt-4">
        <button
          type="button"
          id="btn-back-to-services"
          onClick={onBackToServices}
          className="w-full py-3.5 bg-[#1f2156] hover:bg-[#2c2f6d] active:scale-[0.98] rounded-xl flex justify-center items-center transition-all duration-200 shadow-md text-white text-sm font-bold font-['Poppins'] cursor-pointer"
        >
          Back to Services
        </button>
      </div>
    </main>
  );
};

export default BookingComingSoonView;
