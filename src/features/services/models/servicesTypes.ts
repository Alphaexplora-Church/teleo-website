// features/services/models/servicesTypes.ts
// Model Layer — pure declarative types and static data only.
// No functions, hooks, JSX, or side effects are allowed here.

import type { Church } from '../select-church/models/selectChurchTypes';
import type { ChurchProfileTab } from '../../profile/churchprofile/models/churchProfileTypes';

// ── Types ────────────────────────────────────────────────────────────────────

export type BookingStatus = 'CONFIRMED' | 'PENDING' | 'CANCELLED';

export interface QuickServiceItem {
  id: string;
  label: string;
}

export interface UpcomingBooking {
  id: string;
  /** Short day abbreviation displayed on the date badge (e.g. "SUN") */
  dayAbbr: string;
  /** Numeric day of the month displayed on the date badge */
  dayNumber: number;
  status: BookingStatus;
  serviceName: string;
  time: string;
  venue: string;
}

export type AffiliatedChurch = Church;

export interface ServicesViewProps {
  /** Injected by AppShell — triggers navigation to SelectChurchView. */
  onNavigateToSelectChurch?: (serviceName?: string) => void;
  /** Injected by AppShell — triggers navigation to Church Profile. */
  onNavigateToChurchProfile?: (tab?: ChurchProfileTab) => void;
}

// ── Static Data ──────────────────────────────────────────────────────────────
// TODO: Replace with API-fetched data when backend endpoints are available.

export const QUICK_SERVICES: QuickServiceItem[] = [
  { id: 'baptism', label: 'Baptism' },
  { id: 'house-blessing', label: 'House Blessing' },
  { id: 'counseling', label: 'Counseling' },
  { id: 'prayers', label: 'Prayers' },
  { id: 'funeral', label: 'Funeral' },
  { id: 'dedication', label: 'Dedication' },
];

export const UPCOMING_BOOKINGS: UpcomingBooking[] = [
  {
    id: 'booking-1',
    dayAbbr: 'SUN',
    dayNumber: 20,
    status: 'CONFIRMED',
    serviceName: 'Sunday Service',
    time: '10:00 AM',
    venue: 'Main Sanctuary',
  },
  {
    id: 'booking-2',
    dayAbbr: 'WED',
    dayNumber: 23,
    status: 'PENDING',
    serviceName: 'Baptism Service',
    time: '2:00 PM',
    venue: 'Community Chapel',
  },
];