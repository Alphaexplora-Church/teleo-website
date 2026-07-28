// features/profile/churchprofile/models/churchProfileApi.ts
// Model layer: pure API calls. No React, no hooks — fetch functions only.

import type { ChurchApiRecord } from '../../findmychurch/models/findMyChurchTypes';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

/** Response shape from GET /api/churches/:id */
interface FetchChurchByIdResponse {
  data: ChurchApiRecord;
}

/** Response shape from POST /api/churches/join */
interface JoinChurchResponse {
  message: string;
  data: { profile_id: number; home_church_id: number };
}

/** Response shape from POST /api/churches/leave */
interface LeaveChurchResponse {
  message: string;
  data: { profile_id: number; home_church_id: null };
}

/**
 * Fetches details for a single church by ID.
 * GET /api/churches/:id
 */
export const fetchChurchById = async (id: number): Promise<ChurchApiRecord> => {
  const response = await fetch(`${API_BASE_URL}/api/churches/${id}`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    if (response.status === 404) throw new Error('Church not found.');
    throw new Error(`Failed to fetch church details (${response.status})`);
  }

  const json: FetchChurchByIdResponse = await response.json();
  return json.data;
};

/**
 * Sets the given church as the user's home church.
 * POST /api/churches/join  { church_id }
 */
export const joinChurch = async (churchId: number): Promise<JoinChurchResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/churches/join`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ church_id: churchId }),
  });

  if (!response.ok) {
    throw new Error(`Failed to join church (${response.status})`);
  }

  return response.json();
};

/**
 * Removes the user's current home church assignment.
 * POST /api/churches/leave
 */
export const leaveChurch = async (): Promise<LeaveChurchResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/churches/leave`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Failed to leave church (${response.status})`);
  }

  return response.json();
};
