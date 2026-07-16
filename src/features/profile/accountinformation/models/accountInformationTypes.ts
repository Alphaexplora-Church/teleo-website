// features/profile/accountinformation/models/accountInformationTypes.ts
// Model layer — pure TypeScript definitions only. No functions, hooks, JSX, or side effects.

// ── Profile data shape ─────────────────────────────────────────────────────────

/**
 * Full user profile shape.
 * Mirrors the expected backend shape for GET /api/users/profile.
 * Fields marked optional (?) are not yet surfaced by the API but are
 * reserved here so the ViewModel/View never need updating when the
 * backend adds them.
 */
export interface UserProfileDetails {
  profile_id: number;
  first_name: string;
  last_name: string;
  /** Separate display / nickname field — may differ from first+last. */
  display_name: string;
  /** ISO 8601 date string "YYYY-MM-DD", or null if not set. */
  birthdate: string | null;
  home_church_id: number | null;
  gender: string;
  username: string;
  email: string | null;
  phone_number: string | null;
  location: string | null;
  profile_picture_url: string | null;
  has_accepted_terms: boolean;
  updated_at: string;
}

/**
 * Wrapper returned by GET /api/users/profile.
 * `roles` is intentionally kept as an array so it gracefully supports
 * multi-role users in future without a schema change here.
 */
export interface UserProfileResponse {
  profile: UserProfileDetails;
  roles: { role_type: string; role_description: string }[];
}

// ── Legacy shape (profile-settings endpoint) ───────────────────────────────────
export interface AccountInformationDetails {
  first_name: string;
  last_name: string;
  username: string;
  gender: string;
}

// ── Form state ─────────────────────────────────────────────────────────────────

/**
 * Local editable form state — mirrors every visible field in AccountInformationView.
 * Adding a new field here automatically surfaces the type-error in the ViewModel,
 * ensuring the two layers stay in sync.
 */
export interface AccountInformationFormState {
  username: string;        // read-only; shown with "@" prefix
  firstName: string;
  lastName: string;
  displayName: string;    // editable nickname / preferred name
  location: string;
  birthday: string;       // ISO date string "YYYY-MM-DD" or ""
  gender: string;
}

// ── Update request payload ─────────────────────────────────────────────────────

/**
 * Payload sent to PUT /api/users/profile.
 */
export interface UpdateProfilePayload {
  first_name: string;
  last_name: string;
  display_name?: string;
  birthdate?: string;
  location?: string;
}

// ── Gender options ─────────────────────────────────────────────────────────────

export const GENDER_OPTIONS: readonly string[] = [
  'Male',
  'Female',
  'Non-binary',
  'Prefer not to say',
  'Other',
] as const;

// ── Static seed data ───────────────────────────────────────────────────────────

/**
 * Used by the ViewModel when there is no live API.
 */
export const STATIC_USER_PROFILE: UserProfileResponse = {
  profile: {
    profile_id: 1,
    first_name: 'Ninika',
    last_name: 'Tauro',
    display_name: 'Nika',
    birthdate: '2001-04-15',
    home_church_id: 3,
    gender: 'Female',
    username: 'ninika.santos',
    email: 'ninika@teleo.app',
    phone_number: '+63 912 345 6789',
    location: 'Los Baños, Laguna',
    profile_picture_url: null,
    has_accepted_terms: true,
    updated_at: new Date().toISOString(),
  },
  roles: [
    { role_type: 'member', role_description: 'Church Member' },
    { role_type: 'volunteer', role_description: 'Youth Volunteer' },
  ],
};
