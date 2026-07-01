// features/register/models/registerTypes.ts
// Pure TypeScript types for the registration wizard — NO React, hooks, or JSX

// ── Step enum ────────────────────────────────────────────────
export type RegistrationStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

// ── Gender ───────────────────────────────────────────────────
export type GenderOption = 'male' | 'female' | 'nonbinary' | null;

// ── Location (text-only for now) ─────────────────────────────
export interface LocationData {
  address: string;
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

  // Step 5 (location — text only, map deferred)
  location: LocationData | null;

  // Step 6
  profilePictureFile: File | null;
  profilePictureUrl: string | null; // local object URL for preview
}

// ── Validation error map ─────────────────────────────────────
export type RegistrationErrors = Partial<Record<keyof RegistrationFormData | 'otp' | 'general', string>>;

// ── API result shape ──────────────────────────────────────────
export interface RegisterResult {
  success: boolean;
  error?: string;
}
