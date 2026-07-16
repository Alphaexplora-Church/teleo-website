// features/profile/security/change-email/models/changeEmailTypes.ts
// Model layer — pure TypeScript definitions only. No functions, hooks, JSX, or side effects.

// ── Form state ─────────────────────────────────────────────────────────────────

export interface ChangeEmailFormState {
  /** Read-only — current email address from the user's account. */
  currentEmail: string;
  /** The new email address the user wants to switch to. */
  newEmail: string;
}

// ── Validation helpers ─────────────────────────────────────────────────────────

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ── Static seed data ───────────────────────────────────────────────────────────

/** Simulated current email — replaced by live profile data in production. */
export const STATIC_CURRENT_EMAIL = 'ninika@teleo.app';
