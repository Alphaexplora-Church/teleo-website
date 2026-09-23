// features/profile/findmychurch/models/findMyChurchApi.ts
// Model layer: pure API calls. No React, no hooks — fetch functions only.

import type { ChurchApiRecord, ChurchListMeta } from './selectChurchTypes';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

/** Response shape from GET /api/churches/ */
export interface FetchChurchesResponse {
  data: ChurchApiRecord[];
  meta: ChurchListMeta;
}

/**
 * Fetches a paginated list of active churches.
 * Auth is carried by the httpOnly session cookie.
 *
 * GET /api/churches/?cursor=...&limit=...
 */
export const fetchChurches = async (
  cursor?: string | null,
  limit: number = 20,
): Promise<FetchChurchesResponse> => {
  const params = new URLSearchParams({ limit: String(limit) });
  if (cursor) params.set('cursor', cursor);

  const response = await fetch(`${API_BASE_URL}/api/churches/?${params.toString()}`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch churches (${response.status})`);
  }

  return response.json();
};
