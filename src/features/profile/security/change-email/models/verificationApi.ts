// features/profile/security/change-email/models/verificationApi.ts
// Model layer — API contract definitions and static-data stubs for OTP verification.
// No React, no hooks, no JSX, no side effects.

// ── API endpoint constants ─────────────────────────────────────────────────────

export const VERIFICATION_ENDPOINTS = {
    // TODO: POST — verifies the OTP and commits the email change.
    //   Body: { new_email: string; code: string }
    //   Auth: Bearer token required.
    VERIFY_EMAIL_CODE: '/api/users/security/email/verify',

    // TODO: POST — re-sends the OTP to the target email.
    //   Body: { new_email: string }
    //   Auth: Bearer token required.
    RESEND_VERIFICATION_CODE: '/api/users/security/email/request',
} as const;

// ── Simulated delay ────────────────────────────────────────────────────────────

function simulateDelay(ms = 800): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── API stubs ──────────────────────────────────────────────────────────────────

/**
 * Verifies the OTP and commits the email change.
 * Returns the newly confirmed email address on success.
 */
export async function verifyEmailCode(targetEmail: string, code: string): Promise<string> {
    await simulateDelay(900);

    // Static mode: accept any 6-digit numeric code.
    if (!/^\d{6}$/.test(code)) {
        throw new Error('Invalid verification code. Please check and try again.');
    }

    console.info(`[Verification] Email verified: ${targetEmail}`);
    return targetEmail;
}

/**
 * Re-sends the verification OTP to {@link targetEmail}.
 *
 * TODO: Replace with real fetch call to VERIFICATION_ENDPOINTS.RESEND_VERIFICATION_CODE
 */
export async function resendVerificationCode(targetEmail: string): Promise<void> {
    await simulateDelay(700);
    console.info(`[Verification] Code resent to: ${targetEmail}`);
}
