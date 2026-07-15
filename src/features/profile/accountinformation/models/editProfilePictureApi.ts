// features/profile/accountinformation/models/editProfilePictureApi.ts
// Model layer — API contract definitions and static-data stubs.
// No React, no hooks, no JSX, no side effects.
//
// ── STATIC MODE ────────────────────────────────────────────────────────────────
// Returns resolved Promises to keep the feature fully demo-able without a backend.
// To switch to live API: replace each function body with the commented-out
// fetch implementation.

import type { UpdateProfilePicturePayload } from './editProfilePictureTypes';

// ── API endpoint constants ─────────────────────────────────────────────────────

export const EDIT_PICTURE_ENDPOINTS = {
  /** PUT — accepts multipart/form-data with a `file` field or a `presetId` field. */
  UPDATE_PROFILE_PICTURE: '/api/users/profile/picture',
  /** DELETE — removes the profile picture and reverts to the default placeholder. */
  REMOVE_PROFILE_PICTURE: '/api/users/profile/picture',
} as const;

// ── Simulated delay ────────────────────────────────────────────────────────────

function simulateDelay(ms = 900): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── API stubs ──────────────────────────────────────────────────────────────────

/**
 * Uploads a new profile picture (file or preset).
 * Returns the URL of the newly saved image.
 */
export async function uploadProfilePicture(
  payload: UpdateProfilePicturePayload,
): Promise<string> {
  await simulateDelay(1100);

  // In static mode: if a File was chosen, create a local object URL so the
  // preview in the UI is a "real" image after save. For presets, echo the url
  // that was already passed into the ViewModel.
  if (payload.file) {
    return URL.createObjectURL(payload.file);
  }
  // Preset path: the ViewModel already holds the URL — just echo a success.
  return payload.presetId ?? '';
}

/**
 * Removes the user's profile picture (reverts to placeholder).
 */
export async function removeProfilePicture(): Promise<void> {
  await simulateDelay(700);
  // In static mode, no-op.
}
