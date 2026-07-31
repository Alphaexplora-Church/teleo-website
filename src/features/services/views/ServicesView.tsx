// features/services/views/ServicesView.tsx
// View Layer — dumb UI only. Calls the ViewModel hook and renders.
// NO useState, NO useEffect, NO API calls allowed in this file.

import React from 'react';
import { useServicesViewModel } from '../viewModels/useServicesViewModel';
import type { UpcomingBooking, AffiliatedChurch, QuickServiceItem, ServicesViewProps } from '../models/servicesTypes';
import prayWhiteIcon from '../../../assets/icons/pray-white.svg';

// ── Inline SVG Icon Primitives ────────────────────────────────────────────────
// Stroke-based icons following Teleo brand spec: stroke-width 1.3–1.9px.

const ClockIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#52525b" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const ChevronRightIcon: React.FC = () => (
  <svg width="6" height="8" viewBox="0 0 8 13" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="1 1 7 6.5 1 12" />
  </svg>
);

// ── Quick Service SVG Icons ───────────────────────────────────────────────────

const BaptismIcon: React.FC = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    <path d="M8.5 14c1-.6 2-.6 3 0s2 .6 3 0" strokeWidth="1.5" />
  </svg>
);

const HouseBlessingIcon: React.FC = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
    <path d="M12 10v6M9.5 12h5" strokeWidth="1.6" />
  </svg>
);

const CounselingIcon: React.FC = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="8.5" cy="7" r="3.5" />
    <path d="M3.5 20v-1.5a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4V20" />
    <circle cx="16.5" cy="8" r="2.5" />
    <path d="M14.5 20v-1a3 3 0 0 1 3-3h1a3 3 0 0 1 3 3v1" strokeWidth="1.5" />
  </svg>
);

const PrayersIcon: React.FC = () => (
  <img src={prayWhiteIcon} alt="" className="size-5.5 object-contain" aria-hidden="true" />
);

const FuneralIcon: React.FC = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M8 21h8v-9a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v9z" strokeWidth="1.7" />
    <path d="M12 11V8.5" strokeWidth="1.5" />
    <path d="M12 3c-1.2 1.5-1.8 2.5-1.8 3.5a1.8 1.8 0 0 0 3.6 0c0-1-.6-2-1.8-3.5z" fill="white" stroke="none" />
  </svg>
);

const DedicationIcon: React.FC = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
        className={`inline-block w-2.5 h-2.5 rounded-full ${isConfirmed ? 'bg-blue-700' : 'bg-zinc-500'}`}
        aria-hidden="true"
      />
      <span
        className={`text-[10px] font-medium font-['Roboto'] uppercase leading-3 tracking-wide ${isConfirmed ? 'text-blue-700' : 'text-zinc-700'
          }`}
      >
        {status}
      </span>
    </div>
  );
};

// ── Quick Service Card ────────────────────────────────────────────────────────

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
    className="w-full p-1 inline-flex flex-col items-center gap-1.5 transition-transform duration-150 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-xl cursor-pointer"
  >
    <div
      className={`w-12 h-12 rounded-2xl outline -outline-offset-1 outline-white/20 backdrop-blur-[6px] inline-flex justify-center items-center shrink-0 transition-colors duration-150 ${isSelected ? 'bg-white/25' : 'bg-white/10'
        }`}
    >
      <QuickServiceIcon id={item.id} />
    </div>
    <span className="text-center text-white/90 text-xs font-normal font-['Roboto'] leading-tight">
      {item.label}
    </span>
  </button>
);

// ── Booking Card (temporarily unavailable)─────────────────────────────────────────────────────────────

interface BookingCardProps {
  booking: UpcomingBooking;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
  const isConfirmed = booking.status === 'CONFIRMED';

  return (
    <div
      className="relative w-full p-4 bg-white rounded-2xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline -outline-offset-1 outline-neutral-300 flex justify-between items-center overflow-hidden"
      aria-label={`${booking.serviceName} booking on ${booking.dayAbbr} ${booking.dayNumber}`}
    >
      {/* Coloured left accent strip — confirmed=blue, pending=neutral */}
      <div
        className={`absolute left-0 top-0 w-1 h-full ${isConfirmed ? 'bg-blue-700' : 'bg-neutral-300'}`}
        aria-hidden="true"
      />

      <div className="flex items-center gap-4 pl-2">
        {/* Date badge */}
        <div className="w-12 h-12 bg-gray-200 rounded-lg flex flex-col justify-center items-center shrink-0">
          <span className="text-black/60 text-[10px] font-bold font-['Roboto'] uppercase leading-4 tracking-wide">
            {booking.dayAbbr}
          </span>
          <span className="text-black text-lg font-bold font-['Poppins'] leading-5">
            {booking.dayNumber}
          </span>
        </div>

        {/* Booking details */}
        <div className="flex flex-col gap-1">
          <StatusBadge status={booking.status} />
          <span className="text-black text-lg font-bold font-['Poppins'] leading-6">
            {booking.serviceName}
          </span>
          <div className="inline-flex items-center gap-1.5">
            <ClockIcon />
            <span className="text-black/60 text-sm font-normal font-['Roboto'] leading-5">
              {booking.time} • {booking.venue}
            </span>
          </div>
        </div>
      </div>

      {/* Chevron arrow */}
      <div className="shrink-0">
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
  <div className="w-full bg-white rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline -outline-offset-1 outline-neutral-300 overflow-hidden">
    {church.imageUrl ? (
      <>
        <img
          src={church.imageUrl}
          alt={church.name}
          className="w-full h-32 object-cover"
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
          className="w-full h-32 flex items-center justify-center bg-zinc-200 text-black/50 text-xs font-medium font-['Roboto']"
        >
          No image available
        </div>
      </>
    ) : (
      <div className="w-full h-32 flex items-center justify-center bg-zinc-200 text-black/50 text-xs font-medium font-['Roboto']">
        No image available
      </div>
    )}
    <div className="p-4 flex flex-col gap-1.5">
      <h3 className="text-black text-base font-bold font-['Poppins'] leading-5">
        {church.name}{church.shortName ? ` (${church.shortName})` : ''}
      </h3>

      {church.description && (
        <p className="text-black/60 text-xs font-normal font-['Roboto'] leading-4">
          {church.description}
        </p>
      )}

      <div className="pt-2">
        <button
          type="button"
          id={`btn-view-services-${church.id}`}
          disabled
          className="w-full py-2 bg-[#1f2156] rounded-lg flex justify-center items-center border-none cursor-default"
        >
          <span className="text-white text-xs font-semibold font-['Poppins'] leading-4 tracking-wide">
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
  <div className="w-full flex justify-between items-center pb-2.5">
    <h2 className="text-black text-xl font-bold font-['Poppins'] leading-6">{title}</h2>
    <button
      id={viewAllId}
      type="button"
      onClick={onViewAll}
      className="text-right text-[#336ef9] text-xs font-medium font-['Roboto'] leading-6 transition-opacity duration-150 hover:opacity-75"
    >
      View All
    </button>
  </div>
);

// ── ServicesView (Root View) ───────────────────────────────────────────────────

const ServicesView: React.FC<ServicesViewProps> = ({ onNavigateToSelectChurch, onNavigateToChurchProfile }) => {
  // All state, data, and handlers come exclusively from the ViewModel.
  const {
    quickServicePages,
    upcomingBookings,
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
        <div className="text-center text-navy">
          <div className="mx-auto size-10 animate-spin rounded-full border-[3px] border-navy/15 border-t-navy" />
          <p className="mt-4 text-sm font-semibold">Loading services...</p>
        </div>
      </section>
    );
  }

  return (
    <div className="flex flex-col w-full bg-white min-h-full">
      {/* ── Hero Banner — Quick Services ─────────────────────────────── */}
      <section
        aria-label="Quick Services"
        className="w-full bg-navy rounded-bl-2xl rounded-br-2xl overflow-hidden pb-3 pt-2"
      >
        <div className="border-t border-white/10 flex flex-col gap-2 pt-2">
          {/* Horizontal Paginated Carousel (2 rows x 3 columns per page) */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="w-full flex overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-0"
          >
            {quickServicePages.map((pageItems, pageIdx) => (
              <div
                key={pageIdx}
                className="w-full shrink-0 snap-center grid grid-cols-3 gap-y-2 gap-x-2 px-5 justify-items-center"
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

          {/* Pagination Dots — Centered at Bottom */}
          {totalDots > 1 && (
            <div className="flex justify-center items-center gap-1.5 pt-1" aria-label="Quick services pages">
              {Array.from({ length: totalDots }).map((_, index) => {
                const isActive = index === activeDot;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => scrollToPage(index)}
                    aria-label={`Scroll to quick services page ${index + 1}`}
                    className={`transition-all duration-300 rounded-full cursor-pointer border-none p-0 ${isActive
                      ? 'w-4 h-1.5 bg-white shadow-sm'
                      : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60'
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
        <div className="flex flex-col gap-4">
          <p className="text-black/60 text-xs font-normal font-['Roboto'] py-4 text-center">
            No upcoming bookings yet.
          </p>
          {/*
          {upcomingBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
          */}
        </div>
      </section>

      {/* ── Affiliated Churches ───────────────────────────────────────── */}
      <section aria-label="Affiliated Churches" className="px-5 pt-5 pb-6">
        <SectionHeader
          title="Affiliated Churches"
          onViewAll={onViewAllChurches}
          viewAllId="btn-view-all-churches"
        />
        <div className="flex flex-col gap-4">
          {isLoadingChurches ? (
            <p className="text-black/60 text-xs font-normal font-['Roboto'] py-4 text-center">
              Loading affiliated churches…
            </p>
          ) : churchesError ? (
            <p className="text-red-500 text-xs font-normal font-['Roboto'] py-4 text-center">
              {churchesError}
            </p>
          ) : affiliatedChurches.length === 0 ? (
            <p className="text-black/60 text-xs font-normal font-['Roboto'] py-4 text-center">
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
