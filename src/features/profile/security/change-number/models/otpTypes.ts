// features/profile/security/change-number/models/otpTypes.ts
// Model layer — pure TypeScript definitions only. No functions, hooks, JSX, or side effects.

/** The 6-character OTP string — one character per input cell. */
export type OtpDigits = [string, string, string, string, string, string];

/** Number of OTP digit cells. */
export const OTP_LENGTH = 6;

/** Duration in seconds for the OTP resend cooldown. */
export const OTP_RESEND_SECONDS = 59;
