// features/register/models/registerApi.ts
// Stub API functions — pure TypeScript, no React
// These will be replaced with real endpoint calls in a future iteration.

import type { RegistrationFormData, RegisterResult } from './registerTypes';

/** Simulates sending an OTP to the user's email address. */
export const sendOtpEmail = async (email: string): Promise<{ success: boolean }> => {
  // TODO: Replace with real API call — e.g. POST /api/auth/send-otp
  console.log(`[mock] Sending OTP to: ${email}`);
  await new Promise((res) => setTimeout(res, 900));
  return { success: true };
};

/**
 * Simulates verifying the OTP code.
 * Mock: accepts any 4–6-digit numeric string as valid.
 * TODO: Replace with real API call — e.g. POST /api/auth/verify-otp
 */
export const verifyOtp = async (code: string): Promise<{ success: boolean; error?: string }> => {
  console.log(`[mock] Verifying OTP: ${code}`);
  await new Promise((res) => setTimeout(res, 700));
  // Mock validation: any numeric string of length 4–6 is "valid"
  const isValid = /^\d{4,6}$/.test(code);
  if (isValid) return { success: true };
  return { success: false, error: 'Invalid verification code. Please try again.' };
};

/**
 * Simulates the final registration submission.
 * TODO: Replace with real API call — e.g. POST /api/auth/register
 */
export const submitRegistration = async (data: RegistrationFormData): Promise<RegisterResult> => {
  console.log('[mock] Submitting registration:', { email: data.email, username: data.username });
  await new Promise((res) => setTimeout(res, 1200));
  return { success: true };
};
