// features/services/models/servicesApi.ts
// Model Layer — API endpoint contracts and request/response type definitions.
// No functions, hooks, or side effects. Strictly declarative.

import type { ChurchApiRecord } from '../select-church/models/selectChurchTypes';
import { fetchChurches } from '../select-church/models/selectChurchApi';

/** Base endpoint path for the services resource */
export const SERVICES_ENDPOINT = '/api/v1/services' as const;

/** Base endpoint path for bookings resource */
export const BOOKINGS_ENDPOINT = '/api/v1/bookings' as const;

/** Base endpoint path for affiliated churches resource */
export const CHURCHES_ENDPOINT = '/api/churches' as const;

export { fetchChurches };

// ── Request Types ─────────────────────────────────────────────────────────────

export interface BookServiceRequest {
  serviceId: string;
  churchId: string;
  scheduledAt: string; // ISO 8601
  notes?: string;
}

// ── Response Types ────────────────────────────────────────────────────────────

export interface ServiceApiItem {
  id: string;
  label: string;
  iconUrl?: string;
}

export interface BookingApiItem {
  id: string;
  dayAbbr: string;
  dayNumber: number;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  serviceName: string;
  time: string;
  venue: string;
}

export type ChurchApiItem = ChurchApiRecord;
