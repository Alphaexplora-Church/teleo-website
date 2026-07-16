// features/profile/security/change-number/models/changeNumberTypes.ts
// Model layer — pure TypeScript definitions only. No functions, hooks, JSX, or side effects.

// ── Form state ─────────────────────────────────────────────────────────────────

export interface ChangeNumberFormState {
  /** Read-only — current phone number from user profile. */
  currentPhoneNumber: string;
  /** Selected country code, e.g. "+63". */
  countryCode: string;
  /** New phone number input by the user (excluding country code). */
  newPhoneNumber: string;
}

// ── Country Code definition ────────────────────────────────────────────────────

export interface CountryCodeOption {
  code: string;
  name: string;
}

export const COUNTRY_CODES: readonly CountryCodeOption[] = [
  { code: '+63', name: 'Philippines' },
] as const;

// ── Static seed data ───────────────────────────────────────────────────────────

/** Simulated current phone number — replaced by live profile data in production. */
export const STATIC_CURRENT_PHONE_NUMBER = '+63 912 345 6789';

// ── Validation regex ───────────────────────────────────────────────────────────

/** Validate 10-digit phone number starting with 9 (9XXXXXXXXX). */
export const PHONE_NUMBER_REGEX = /^9\d{9}$/;

