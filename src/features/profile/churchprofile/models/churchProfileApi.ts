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

import { mapContentFeedRecord } from '../../../home/models/homeApi';
import type { FeedPostModel, ContentFeedRecord } from '../../../home/models/homeTypes';

interface PublicContentsResponse {
  data: ContentFeedRecord[];
}

/**
 * Fetches active public announcements for a specific church.
 * GET /api/contents/public/announcements/:churchId
 */
export const fetchChurchAnnouncements = async (churchId: number): Promise<FeedPostModel[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/contents/public/announcements/${churchId}`, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) return [];

    const json: PublicContentsResponse = await response.json();
    if (!Array.isArray(json?.data)) return [];

    return json.data.map(mapContentFeedRecord).filter((post) => post.category === 'Announcement');
  } catch (err) {
    console.error('Failed to fetch church announcements:', err);
    return [];
  }
};

/**
 * Fetches active public events for a specific church.
 * GET /api/contents/public/events/:churchId
 */
export const fetchChurchEvents = async (churchId: number): Promise<FeedPostModel[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/contents/public/events/${churchId}`, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) return [];

    const json: PublicContentsResponse = await response.json();
    if (!Array.isArray(json?.data)) return [];

    return json.data.map(mapContentFeedRecord).filter((post) => post.category === 'Events');
  } catch (err) {
    console.error('Failed to fetch church events:', err);
    return [];
  }
};

/**
 * Fetches both announcements and events for a church in parallel.
 */
export const fetchChurchContents = async (
  churchId: number
): Promise<{ announcements: FeedPostModel[]; events: FeedPostModel[] }> => {
  const [announcements, events] = await Promise.all([
    fetchChurchAnnouncements(churchId),
    fetchChurchEvents(churchId),
  ]);

  return { announcements, events };
};
