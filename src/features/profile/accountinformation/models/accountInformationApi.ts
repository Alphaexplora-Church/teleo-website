// features/profile/accountinformation/models/accountInformationApi.ts
// Model layer — API contract definitions and static-data stubs.
// No React, no hooks, no JSX, no side effects.
//
// ── STATIC MODE ────────────────────────────────────────────────────────────────
// All functions return resolved Promises from STATIC_USER_PROFILE so the
// feature is fully demo-able without a running backend.
// To switch to live API: replace each function body with the commented-out
// fetch implementation directly below it. The type signatures are identical.

import type {
  UserProfileResponse,
  UpdateProfilePayload,
} from './accountInformationTypes';
import { STATIC_USER_PROFILE } from './accountInformationTypes';

// ── API endpoint constants ─────────────────────────────────────────────────────
// Preserved for future use — no fetch calls are made in static mode.

export const ACCOUNT_INFO_ENDPOINTS = {
  /** GET — fetches full user_profile row */
  GET_CURRENT_PROFILE: '/api/users/profile',
  /** PUT — updates first_name, last_name, display_name, birthdate, location */
  UPDATE_CURRENT_PROFILE: '/api/users/profile',
} as const;

// ── Simulated network delay ────────────────────────────────────────────────────

/** Simulates realistic network latency for a polished loading-state demo. */
function simulateDelay(ms = 600): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── In-memory store ───────────────────────────────────────────────────────────
// Mutable so that save operations are reflected immediately on re-fetch.

let _storedProfile: UserProfileResponse = {
  ...STATIC_USER_PROFILE,
  profile: { ...STATIC_USER_PROFILE.profile },
};

// ── API stubs ──────────────────────────────────────────────────────────────────

/**
 * Returns the current user profile from in-memory static data.
 */
export async function fetchCurrentUserProfile(): Promise<UserProfileResponse> {
  await simulateDelay(700);
  return { ..._storedProfile, profile: { ..._storedProfile.profile } };
}

/**
 * Merges the update payload into the in-memory store and returns the result.
 */
export async function updateUserProfile(
  payload: UpdateProfilePayload,
): Promise<UserProfileResponse> {
  await simulateDelay(900);

  _storedProfile = {
    ..._storedProfile,
    profile: {
      ..._storedProfile.profile,
      first_name: payload.first_name,
      last_name: payload.last_name,
      display_name: payload.display_name ?? _storedProfile.profile.display_name,
      birthdate: payload.birthdate ?? _storedProfile.profile.birthdate,
      location: payload.location ?? _storedProfile.profile.location,
      updated_at: new Date().toISOString(),
    },
  };

  return { ..._storedProfile, profile: { ..._storedProfile.profile } };
}
