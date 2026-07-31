// features/services/models/servicesTypes.ts
// Model Layer — pure declarative types and static data only.
// No functions, hooks, JSX, or side effects are allowed here.

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

export interface AffiliatedChurch {
  id: string;
  name: string;
  address: string;
  phone: string;
  imageUrl: string;
}

// ── Static Data ──────────────────────────────────────────────────────────────
// TODO: Replace with API-fetched data when backend endpoints are available.

export const QUICK_SERVICES: QuickServiceItem[] = [
  { id: 'baptism',          label: 'Baptism'          },
  { id: 'house-blessing',   label: 'House Blessing'   },
  { id: 'counseling',       label: 'Counseling'       },
  { id: 'prayers',          label: 'Prayers'          },
  { id: 'funeral',          label: 'Funeral'          },
  { id: 'dedication',       label: 'Dedication'       },
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

export const AFFILIATED_CHURCHES: AffiliatedChurch[] = [
  {
    id: 'church-1',
    name: "St. Jude's Cathedral",
    address: 'P. Sherman, 42 Wallaby Way, Sydney',
    phone: '0928 382 9329',
    imageUrl: 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&w=720&q=80',
  },
  {
    id: 'church-2',
    name: 'Grace Community Church',
    address: '7th Avenue, BGC, Taguig City',
    phone: '0932 411 2290',
    imageUrl: 'https://images.unsplash.com/photo-1554732578-20f0d6b17f1c?auto=format&fit=crop&w=720&q=80',
  },
];
