// features/services/booking-schedule/models/bookScheduleTypes.ts
// Model Layer — pure declarative types and static data only.
// No functions, hooks, JSX, or side effects are allowed here.

export interface TimeSlotOption {
  id: string;
  time: string;
  available: boolean;
}

export interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isPast: boolean;
  isSelected: boolean;
  isToday: boolean;
}

export interface MonthOption {
  index: number;
  shortName: string;
  fullName: string;
  isDisabled: boolean;
}

export interface ServiceDetail {
  id: string;
  name: string;
  bannerUrl: string;
  overview: string;
  duration: string;
  maxGuests: string;
  requirements: string[];
  timeSlots: TimeSlotOption[];
}

// ── Static Data ──────────────────────────────────────────────────────────────
// TODO: Replace with API-fetched data when backend booking endpoints are ready.

export const DEFAULT_SERVICE_DETAIL: ServiceDetail = {
  id: 'baptism',
  name: 'Baptism',
  bannerUrl: 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&w=720&q=80',
  overview: 'A sacred ceremony welcoming individuals into the Christian faith through holy baptism, prayer, and community blessings.',
  duration: '90 Min Service',
  maxGuests: 'Up to 250 Guests',
  requirements: [
    'Pre-Cana Workshop',
    'Meeting with Pastor',
    'Baptismal Certificates Request',
  ],
  timeSlots: [
    { id: 't1', time: '10:00 AM', available: true },
    { id: 't2', time: '1:00 PM', available: true },
    { id: 't3', time: '3:00 PM', available: true },
  ],
};

export const SERVICE_DETAILS_MAP: Record<string, ServiceDetail> = {
  baptism: DEFAULT_SERVICE_DETAIL,
  'house-blessing': {
    id: 'house-blessing',
    name: 'House Blessing',
    bannerUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=720&q=80',
    overview: 'A special pastoral visit to bless your new home, invoke God’s protection, and dedicate your household to faith and love.',
    duration: '60 Min Service',
    maxGuests: 'Up to 50 Guests',
    requirements: [
      'Home Address & Vicinity Details',
      'Brief Consultation with Officiant',
      'Family Attendance Confirmation',
    ],
    timeSlots: [
      { id: 'hb1', time: '9:00 AM', available: true },
      { id: 'hb2', time: '11:30 AM', available: true },
      { id: 'hb3', time: '4:00 PM', available: true },
    ],
  },
  counseling: {
    id: 'counseling',
    name: 'Counseling',
    bannerUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=720&q=80',
    overview: 'Confidential pastoral guidance and spiritual counseling to support you through life’s challenges, relationships, and personal growth.',
    duration: '60 Min Service',
    maxGuests: '1-2 Guests',
    requirements: [
      'Pre-session Intake Form',
      'Confidentiality Agreement',
      'Brief Pastoral Overview',
    ],
    timeSlots: [
      { id: 'c1', time: '10:00 AM', available: true },
      { id: 'c2', time: '2:00 PM', available: true },
      { id: 'c3', time: '5:00 PM', available: true },
    ],
  },
  prayers: {
    id: 'prayers',
    name: 'Prayers',
    bannerUrl: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=720&q=80',
    overview: 'A focused intercessory prayer session with church leaders for health, healing, spiritual guidance, and thanksgiving.',
    duration: '45 Min Service',
    maxGuests: 'Up to 30 Guests',
    requirements: [
      'Prayer Intentions Submission',
      'Confession (Optional)',
    ],
    timeSlots: [
      { id: 'p1', time: '8:30 AM', available: true },
      { id: 'p2', time: '11:00 AM', available: true },
      { id: 'p3', time: '6:00 PM', available: true },
    ],
  },
  funeral: {
    id: 'funeral',
    name: 'Funeral',
    bannerUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=720&q=80',
    overview: 'A dignified memorial service honoring your loved one and commending their soul to eternal peace.',
    duration: '90 Min Service',
    maxGuests: 'Up to 300 Guests',
    requirements: [
      'Death Certificate Copy',
      'Family Officiant Meeting',
      'Eulogy & Liturgy Coordination',
    ],
    timeSlots: [
      { id: 'f1', time: '9:30 AM', available: true },
      { id: 'f2', time: '1:30 PM', available: true },
    ],
  },
  dedication: {
    id: 'dedication',
    name: 'Dedication',
    bannerUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=720&q=80',
    overview: 'Presenting your child to the Lord in a dedicated blessing ceremony before the congregation and godparents.',
    duration: '60 Min Service',
    maxGuests: 'Up to 150 Guests',
    requirements: [
      'Parents & Godparents Counseling',
      'Birth Certificate Copy',
    ],
    timeSlots: [
      { id: 'd1', time: '10:30 AM', available: true },
      { id: 'd2', time: '2:30 PM', available: true },
    ],
  },
};
