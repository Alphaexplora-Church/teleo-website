// features/register/models/registerTypes.ts
// Pure TypeScript types for the registration wizard — NO React, hooks, or JSX

// ── Step enum ────────────────────────────────────────────────
export type RegistrationStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

// ── Gender ───────────────────────────────────────────────────
export type GenderOption = 'male' | 'female' | 'nonbinary' | null;

// ── Location ─────────────────────────────────────────────────
export interface LocationData {
  address: string;
  lat: number;
  lng: number;
}

// ── Cumulative form data collected across all steps ──────────
export interface RegistrationFormData {
  // Step 1
  email: string;
  password: string;
  confirmPassword: string;

  // Step 2 — OTP handled transiently in ViewModel

  // Step 3
  firstName: string;
  lastName: string;
  birthMonth: string;
  birthDay: string;
  birthYear: string;

  // Step 4
  gender: GenderOption;
  username: string;

  // Step 5 (location — interactive Leaflet map)
  location: LocationData | null;

  // Step 6
  profilePictureFile: File | null;
  profilePictureUrl: string | null; // local object URL for preview
}

// ── Validation error map ─────────────────────────────────────
export type RegistrationErrors = Partial<Record<keyof RegistrationFormData | 'otp' | 'general', string>>;

// ── API result shapes ─────────────────────────────────────────

/**
 * Result from POST /api/auth/register.
 * When OTP is bypassed on the backend, `accessToken` will be populated
 * from data.session.access_token in the response.
 */
export interface RegisterApiResult {
  success: boolean;
  accessToken?: string | null;
  error?: string;
}

/**
 * Result from POST /api/profiles/me.
 */
export interface ProfileApiResult {
  success: boolean;
  error?: string;
}

/** @deprecated Use RegisterApiResult or ProfileApiResult instead */
export interface RegisterResult {
  success: boolean;
  error?: string;
}
