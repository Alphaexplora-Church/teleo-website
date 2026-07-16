// features/profile/security/change-password/models/changePasswordTypes.ts
// Model layer — pure TypeScript definitions only. No functions, hooks, JSX, or side effects.

// ── Form state ─────────────────────────────────────────────────────────────────

export interface ChangePasswordFormState {
  /** The new password the user wants to set. */
  newPassword: string;
  /** Retype of the new password to confirm. */
  confirmPassword: string;
}

// ── Validation constraints ─────────────────────────────────────────────────────

/** Minimum length required for the password. */
export const MIN_PASSWORD_LENGTH = 8;
