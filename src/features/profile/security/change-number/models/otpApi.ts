// features/profile/security/change-number/models/otpApi.ts
// Model layer — API contract definitions and static-data stubs for OTP verification.
// No React, no hooks, no JSX, no side effects.

export const OTP_ENDPOINTS = {
  // TODO: POST — verifies the OTP and commits the phone number change.
  //   Body: { phone_number: string; code: string }
  //   Auth: Bearer token required.
  VERIFY_OTP: '/api/users/security/phone/verify',

  // TODO: POST — re-sends the OTP to the target phone number.
  //   Body: { phone_number: string }
  //   Auth: Bearer token required.
  RESEND_OTP: '/api/users/security/phone/request',
} as const;

function simulateDelay(ms = 800): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Verifies the OTP and commits the phone number change.
 * Returns the newly confirmed phone number on success.
 */
export async function verifyOtpCode(targetNumber: string, code: string): Promise<string> {
  await simulateDelay(900);

  // Static mode: accept any 6-digit numeric code.
  if (!/^\d{6}$/.test(code)) {
    throw new Error('Invalid verification code. Please check and try again.');
  }

  console.info(`[OtpApi] Phone number verified: ${targetNumber}`);
  return targetNumber;
}

/**
 * Re-sends the verification OTP to {@link targetNumber}.
 */
export async function resendOtpCode(targetNumber: string): Promise<void> {
  await simulateDelay(700);
  console.info(`[OtpApi] Code resent to: ${targetNumber}`);
}
