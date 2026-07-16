// features/profile/security/change-password/models/changePasswordApi.ts
// Model layer — API contract definitions and static-data stubs for change password.
// No React, no hooks, no JSX, no side effects.

// ── API endpoint constants ─────────────────────────────────────────────────────

export const CHANGE_PASSWORD_ENDPOINTS = {
  // TODO: POST — validates and updates the user's password.
  //   Body: { password: string }
  //   Auth: Bearer token required.
  UPDATE_PASSWORD: '/api/users/security/password',
} as const;

// ── Simulated delay ────────────────────────────────────────────────────────────

function simulateDelay(ms = 800): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── API stubs ──────────────────────────────────────────────────────────────────

/**
 * Sends a request to update the account password.
 *
 * TODO: Replace body with real fetch call to CHANGE_PASSWORD_ENDPOINTS.UPDATE_PASSWORD:
 */
export async function changePassword(password: string): Promise<void> {
  await simulateDelay(1000);
  console.info(`[ChangePassword] Password of length ${password.length} updated successfully (simulated)`);
}
