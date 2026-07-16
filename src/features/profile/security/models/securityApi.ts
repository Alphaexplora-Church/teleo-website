// features/profile/security/models/securityApi.ts
// Model layer — API contract definitions and static-data stubs.
// No React, no hooks, no JSX, no side effects.
//
// ── STATIC MODE ────────────────────────────────────────────────────────────────
// All functions return resolved Promises so the feature is fully demo-able
// without a running backend.

import type { SecurityActionId } from './securityTypes';

// ── API endpoint constants ─────────────────────────────────────────────────────

export const SECURITY_ENDPOINTS = {
  /** POST — sends a one-time verification code to the new email address. */
  REQUEST_EMAIL_CHANGE: '/api/users/security/email',
  /** POST — validates current password and sets a new one. */
  REQUEST_PASSWORD_CHANGE: '/api/users/security/password',
  /** POST — sends an OTP to the new phone number for verification. */
  REQUEST_PHONE_CHANGE: '/api/users/security/phone',
  /** DELETE — permanently deletes the authenticated user's account. */
  DELETE_ACCOUNT: '/api/users/account',
  /** External URL — served outside the API. */
  PRIVACY_POLICY_URL: 'https://teleo.app/privacy',
} as const;

// ── Simulated delay ────────────────────────────────────────────────────────────

function simulateDelay(ms = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── API stubs ──────────────────────────────────────────────────────────────────

/**
 * Handles navigation intent for a given security action.
 * In static mode this is a no-op — navigation is handled by the ViewModel
 * via callbacks. The real implementation will trigger a modal or sub-page.
 */
export async function triggerSecurityAction(
  actionId: SecurityActionId,
): Promise<void> {
  await simulateDelay(200);
  console.info(`[Security] Action triggered: ${actionId}`);
}

/**
 * Permanently deletes the authenticated user's account.
 */
export async function deleteUserAccount(): Promise<void> {
  await simulateDelay(1200);
  // Static mode: no-op. Wires cleanly to a real DELETE call.
}
