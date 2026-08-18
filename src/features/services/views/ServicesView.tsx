// features/services/views/ServicesView.tsx
// View Layer — dumb UI only. Calls the ViewModel hook and renders.
// NO useState, NO useEffect, NO API calls allowed in this file.

import React from 'react';
import { useServicesViewModel } from '../viewModels/useServicesViewModel';
import type { UpcomingBooking, AffiliatedChurch, QuickServiceItem, ServicesViewProps } from '../models/servicesTypes';
import prayWhiteIcon from '../../../assets/icons/pray-white.svg';

// ── Inline SVG Icon Primitives ────────────────────────────────────────────────

const ClockIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#757575" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const ChevronRightIcon: React.FC = () => (
  <svg width="6" height="10" viewBox="0 0 8 13" fill="none" stroke="#336ef9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="1 1 7 6.5 1 12" />
  </svg>
);

// ── Quick Service SVG Icons (Scales reduced to 18px) ─────────────────────────

const BaptismIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    <path d="M8.5 14c1-.6 2-.6 3 0s2 .6 3 0" strokeWidth="1.5" />
  </svg>
);

const HouseBlessingIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
    <path d="M12 10v6M9.5 12h5" strokeWidth="1.6" />
  </svg>
);

const CounselingIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="8.5" cy="7" r="3.5" />
    <path d="M3.5 20v-1.5a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4V20" />
    <circle cx="16.5" cy="8" r="2.5" />
    <path d="M14.5 20v-1a3 3 0 0 1 3-3h1a3 3 0 0 1 3 3v1" strokeWidth="1.5" />
  </svg>
);

const PrayersIcon: React.FC = () => (
  <img src={prayWhiteIcon} alt="" className="size-4.5 object-contain" aria-hidden="true" />
);

const FuneralIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M8 21h8v-9a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v9z" strokeWidth="1.7" />
    <path d="M12 11V8.5" strokeWidth="1.5" />
    <path d="M12 3c-1.2 1.5-1.8 2.5-1.8 3.5a1.8 1.8 0 0 0 3.6 0c0-1-.6-2-1.8-3.5z" fill="white" stroke="none" />
  </svg>
);

const DedicationIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="9.5" r="3.5" strokeWidth="1.7" />
    <path d="M6 20a6 6 0 0 1 12 0" strokeWidth="1.7" />
    <path d="M12 2v2.5M10.75 3.25h2.5" strokeWidth="1.5" />
  </svg>
);

const QuickServiceIcon: React.FC<{ id: string }> = ({ id }) => {
  switch (id) {
    case 'baptism':
      return <BaptismIcon />;
    case 'house-blessing':
      return <HouseBlessingIcon />;
    case 'counseling':
      return <CounselingIcon />;
    case 'prayers':
      return <PrayersIcon />;
    case 'funeral':
      return <FuneralIcon />;
    case 'dedication':
      return <DedicationIcon />;
    default:
      return <BaptismIcon />;
  }
};

// ── Status Badge ─────────────────────────────────────────────────────────────

interface StatusBadgeProps {
  status: UpcomingBooking['status'];
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const isConfirmed = status === 'CONFIRMED';
  return (
    <div className="inline-flex items-center gap-1.5">
      <span
        className={`inline-block size-2 rounded-full ${isConfirmed ? 'bg-[#336ef9]' : 'bg-zinc-400'}`}
        aria-hidden="true"
      />
      <span
        className={`text-xs font-semibold uppercase leading-tight tracking-wide ${isConfirmed ? 'text-[#336ef9]' : 'text-zinc-600'
          }`}
      >
        {status}
      </span>
    </div>
  );
};

// ── Compact Quick Service Card ────────────────────────────────────────────────

interface QuickServiceCardProps {
  item: QuickServiceItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const QuickServiceCard: React.FC<QuickServiceCardProps> = ({ item, isSelected, onSelect }) => (
  <button
    type="button"
    onClick={() => onSelect(item.id)}
    aria-label={`Book ${item.label}`}
    aria-pressed={isSelected}
    className="w-full p-0.5 inline-flex flex-col items-center gap-1 transition-transform duration-150 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-lg cursor-pointer"
  >
    {/* Scaled down icon badge to 40px (size-10) */}
    <div
      className={`size-10 rounded-xl border border-white/20 backdrop-blur-[6px] inline-flex justify-center items-center shrink-0 transition-colors duration-150 ${isSelected ? 'bg-white/25 shadow-sm' : 'bg-white/10 hover:bg-white/15'
        }`}
    >
      <QuickServiceIcon id={item.id} />
    </div>
    <span className="text-center text-white/90 text-[11px] font-medium leading-tight">
      {item.label}
    </span>
  </button>
);

// ── Booking Card ─────────────────────────────────────────────────────────────

interface BookingCardProps {
  booking: UpcomingBooking;
}

export const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
  const isConfirmed = booking.status === 'CONFIRMED';

  return (
    <div
      className="relative w-full p-4 bg-white rounded-2xl border border-zinc-200 shadow-sm flex justify-between items-center overflow-hidden transition-all duration-200 hover:shadow-md"
      aria-label={`${booking.serviceName} booking on ${booking.dayAbbr} ${booking.dayNumber}`}
    >
      <div
        className={`absolute left-0 top-0 w-1 h-full ${isConfirmed ? 'bg-[#336ef9]' : 'bg-zinc-300'}`}
        aria-hidden="true"
      />

      <div className="flex items-center gap-4 pl-2">
        <div className="size-12 bg-zinc-100 rounded-xl flex flex-col justify-center items-center shrink-0">
          <span className="text-black/60 text-xs font-bold uppercase leading-none tracking-wide">
            {booking.dayAbbr}
          </span>
          <span className="text-black text-lg font-bold leading-snug mt-0.5">
            {booking.dayNumber}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <StatusBadge status={booking.status} />
          <h3 className="text-black text-base font-semibold leading-snug">
            {booking.serviceName}
          </h3>
          <div className="inline-flex items-center gap-1.5">
            <ClockIcon />
            <span className="text-black/60 text-xs font-normal leading-normal">
              {booking.time} • {booking.venue}
            </span>
          </div>
        </div>
      </div>

      <div className="shrink-0 pl-2">
        <ChevronRightIcon />
      </div>
    </div>
  );
};

// ── Church Card ───────────────────────────────────────────────────────────────

interface ChurchCardProps {
  church: AffiliatedChurch;
  onViewServices: (id: string | number) => void;
}

const ChurchCard: React.FC<ChurchCardProps> = ({ church, onViewServices }) => (
  <div className="w-full bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
    {church.imageUrl ? (
      <>
        <img
          src={church.imageUrl}
          alt={church.name}
          className="w-full h-36 object-cover"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            if (e.currentTarget.nextElementSibling instanceof HTMLElement) {
              e.currentTarget.nextElementSibling.style.display = 'flex';
            }
          }}
        />
        <div
          style={{ display: 'none' }}
          className="w-full h-36 flex items-center justify-center bg-zinc-100 text-black/50 text-xs font-medium"
        >
          No image available
        </div>
      </>
    ) : (
      <div className="w-full h-36 flex items-center justify-center bg-zinc-100 text-black/50 text-xs font-medium">
        No image available
      </div>
    )}
    <div className="p-4 flex flex-col">
      <h3 className="text-black text-lg font-semibold leading-snug">
        {church.name}{church.shortName ? ` (${church.shortName})` : ''}
      </h3>

      {church.description && (
        <p className="text-black/60 text-xs font-normal leading-relaxed line-clamp-2">
          {church.description}
        </p>
      )}

      <div className="pt-2">
        <button
          type="button"
          id={`btn-view-services-${church.id}`}
          onClick={() => onViewServices(church.id)}
          className="w-full py-2.5 bg-[#1f2156] hover:bg-[#2c2f6d] active:scale-[0.98] transition-all duration-200 rounded-xl flex justify-center items-center border-none cursor-pointer"
        >
          <span className="text-white text-xs font-medium leading-tight tracking-wide">
            View Services Offered
          </span>
        </button>
      </div>
    </div>
  </div>
);

// ── Section Header ────────────────────────────────────────────────────────────

interface SectionHeaderProps {
  title: string;
  onViewAll: () => void;
  viewAllId: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, onViewAll, viewAllId }) => (
  <div className="w-full flex justify-between items-center pb-3">
    <h2 className="text-black text-xl font-semibold leading-snug">{title}</h2>
    <button
      id={viewAllId}
      type="button"
      onClick={onViewAll}
      className="text-right text-[#336ef9] text-sm font-medium transition-opacity duration-150 hover:opacity-75 cursor-pointer"
    >
      View All
    </button>
  </div>
);

// ── ServicesView (Root View) ───────────────────────────────────────────────────

const ServicesView: React.FC<ServicesViewProps> = ({ onNavigateToSelectChurch, onNavigateToChurchProfile }) => {
  const {
    quickServicePages,
    upcomingBookings: _upcomingBookings,
    affiliatedChurches,
    isLoading,
    isLoadingChurches,
    churchesError,
    selectedServiceId,
    scrollRef,
    activeDot,
    totalDots,
    handleScroll,
    scrollToPage,
    onSelectService,
    onViewAllBookings,
    onViewAllChurches,
    onViewChurchServices,
  } = useServicesViewModel({ onNavigateToSelectChurch, onNavigateToChurchProfile });

  if (isLoading) {
    return (
      <section className="fixed inset-0 z-10 flex min-h-dvh items-center justify-center bg-[#faf9f7]">
        <div className="text-center text-[#1f2156]">
          <div className="mx-auto size-10 animate-spin rounded-full border-[3px] border-[#1f2156]/15 border-t-[#1f2156]" />
          <p className="mt-4 text-sm font-semibold">Loading services...</p>
        </div>
      </section>
    );
  }

  return (
    <div className="flex flex-col w-full bg-white min-h-full">
      {/* ── Hero Banner — Quick Services (Compact Heights) ─────────────── */}
      <section
        aria-label="Quick Services"
        className="w-full bg-navy rounded-bl-2xl rounded-br-2xl overflow-hidden pt-1.5 pb-2"
      >
        <div className="border-t border-white/10 flex flex-col gap-1.5 pt-2">
          {/* Horizontal Paginated Carousel */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="w-full flex overflow-x-auto scrollbar-hide snap-x snap-mandatory"
          >
            {quickServicePages.map((pageItems, pageIdx) => (
              <div
                key={pageIdx}
                className="w-full shrink-0 snap-center grid grid-cols-3 gap-y-1 gap-x-2 px-5 justify-items-center"
              >
                {pageItems.map((item) => (
                  <QuickServiceCard
                    key={item.id}
                    item={item}
                    isSelected={selectedServiceId === item.id}
                    onSelect={onSelectService}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Compact Pagination Dots */}
          {totalDots > 1 && (
            <div className="flex justify-center items-center gap-1.5" aria-label="Quick services pages">
              {Array.from({ length: totalDots }).map((_, index) => {
                const isActive = index === activeDot;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => scrollToPage(index)}
                    aria-label={`Scroll to quick services page ${index + 1}`}
                    className={`transition-all duration-300 rounded-full cursor-pointer border-none p-0 ${isActive
                      ? 'w-3 h-1 bg-white shadow-sm'
                      : 'w-1 h-1 bg-white/30 hover:bg-white/60'
                      }`}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Upcoming Bookings ─────────────────────────────────────────── */}
      <section aria-label="Upcoming Bookings" className="px-5 pt-4">
        <SectionHeader
          title="Upcoming Bookings"
          onViewAll={onViewAllBookings}
          viewAllId="btn-view-all-bookings"
        />
        <div className="flex flex-col gap-3">
          <p className="text-[#757575] text-xs font-normal py-3 text-center">
            No upcoming bookings yet.
          </p>
        </div>
      </section>

      {/* ── Affiliated Churches ───────────────────────────────────────── */}
      <section aria-label="Affiliated Churches" className="px-5 pt-5 pb-8">
        <SectionHeader
          title="Affiliated Churches"
          onViewAll={onViewAllChurches}
          viewAllId="btn-view-all-churches"
        />
        <div className="flex flex-col gap-4">
          {isLoadingChurches ? (
            <p className="text-[#757575] text-xs font-normal py-3 text-center">
              Loading affiliated churches…
            </p>
          ) : churchesError ? (
            <p className="text-[#ff0000] text-xs font-normal py-3 text-center">
              {churchesError}
            </p>
          ) : affiliatedChurches.length === 0 ? (
            <p className="text-[#757575] text-xs font-normal py-3 text-center">
              No affiliated churches available.
            </p>
          ) : (
            affiliatedChurches.slice(0, 2).map((church) => (
              <ChurchCard
                key={church.id}
                church={church}
                onViewServices={onViewChurchServices}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default ServicesView;