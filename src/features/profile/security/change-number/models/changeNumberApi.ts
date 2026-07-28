// features/profile/security/change-number/models/changeNumberApi.ts
// Model layer — API contract definitions and static-data stubs for changing phone number.
// No React, no hooks, no JSX, no side effects.
//
// ── STATIC MODE ────────────────────────────────────────────────────────────────
// All functions resolve immediately to keep the feature demo-able without a backend.

// ── API endpoint constants ─────────────────────────────────────────────────────

export const CHANGE_PHONE_ENDPOINTS = {
  // FUTURE TODO: POST — sends an OTP code via SMS to the new phone number.
  //   Body: { country_code: string; phone_number: string }
  //   Auth: Bearer token required.
  SEND_OTP: '/api/users/security/phone/request',
} as const;

// ── Simulated delay ────────────────────────────────────────────────────────────

function simulateDelay(ms = 800): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── API stubs ──────────────────────────────────────────────────────────────────

/**
 * Requests sending an OTP SMS code to the new phone number.
 *
 * FUTURE TODO: Replace body with real fetch call to CHANGE_PHONE_ENDPOINTS.SEND_OTP:
 *   const res = await fetch(CHANGE_PHONE_ENDPOINTS.SEND_OTP, {
 *     method: 'POST',
 *     headers: {
 *       'Content-Type': 'application/json',
 *       Authorization: `Bearer ${localStorage.getItem('access_token')}`,
 *     },
 *     body: JSON.stringify({ country_code: countryCode, phone_number: newNumber }),
 *   });
 *   if (!res.ok) {
 *     const err = await res.json().catch(() => ({}));
 *     throw new Error((err as { message?: string }).message ?? `Request failed (${res.status})`);
 *   }
 */
export async function sendOtpCode(countryCode: string, newNumber: string): Promise<void> {
  await simulateDelay(1000);
  console.info(`[ChangeNumber] OTP sent to: ${countryCode} ${newNumber}`);
}
