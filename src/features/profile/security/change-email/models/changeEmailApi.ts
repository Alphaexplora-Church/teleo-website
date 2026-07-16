// features/profile/security/change-email/models/changeEmailApi.ts
// Model layer — API contract definitions and static-data stubs.
// No React, no hooks, no JSX, no side effects.
//
// ── STATIC MODE ────────────────────────────────────────────────────────────────
// All functions resolve immediately to keep the feature demo-able without a backend.

// ── API endpoint constants ─────────────────────────────────────────────────────

export const CHANGE_EMAIL_ENDPOINTS = {
  // TODO: POST — sends a verification OTP to the new email address.
  //   Body: { new_email: string }
  //   Auth: Bearer token required.
  SEND_VERIFICATION_CODE: '/api/users/security/email/request',
} as const;

// ── Simulated delay ────────────────────────────────────────────────────────────

function simulateDelay(ms = 800): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── API stubs ──────────────────────────────────────────────────────────────────

/**
 * Sends a 6-digit verification OTP to {@link newEmail}.
 * Returns void — the OTP arrives out-of-band via email.
 *
 * TODO: Replace body with real fetch call to CHANGE_EMAIL_ENDPOINTS.SEND_VERIFICATION_CODE:
 */
export async function sendVerificationCode(newEmail: string): Promise<void> {
  await simulateDelay(1000);
  console.info(`[ChangeEmail] Verification code sent to: ${newEmail}`);
}
