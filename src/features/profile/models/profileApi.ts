// features/profile/models/profileApi.ts
// Pure TypeScript API calls — no React, no hooks, no JSX.

import type { ProfileSettingsView } from './profileTypes';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

/**
 * Fetches the profile settings view data for the authenticated user.
 * Auth is carried by the httpOnly session cookie.
 *
 * GET /api/profile-settings/view
 */
export const fetchProfileSettingsView = async (): Promise<ProfileSettingsView> => {
  const response = await fetch(`${API_BASE_URL}/api/profile-settings/view`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Profile view data not found.');
    }
    throw new Error(`Failed to fetch profile settings view (${response.status})`);
  }

  const json = await response.json();
  return json.data as ProfileSettingsView;
};
