// features/register/models/registerApi.ts
// Real API calls — pure TypeScript, no React, no hooks, no JSX

import type { RegistrationFormData, RegisterApiResult, ProfileApiResult } from './registerTypes';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

/**
 * POST /api/auth/register
 *
 * Creates the auth account. When OTP email confirmation is bypassed on the
 * backend (Supabase setting), the response includes a live session with an
 * access_token — we capture it here so the caller can immediately use it for
 * authenticated requests (e.g. POST /api/profiles/me).
 */
export const registerAccount = async (
  email: string,
  password: string
): Promise<RegisterApiResult> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      if (response.status === 429) {
        return { success: false, error: 'Too many requests. Please wait a moment and try again.' };
      }
      return {
        success: false,
        error: data?.message || `Registration failed (${response.status}).`,
      };
    }

    // When OTP bypass is active, data.data.session holds the access token.
    const accessToken = data?.data?.session?.access_token ?? null;

    return { success: true, accessToken };
  } catch {
    return { success: false, error: 'Network error. Please check your connection.' };
  }
};

/**
 * POST /api/profiles/me
 *
 * Creates or updates the user's personal profile. Requires a valid Bearer JWT
 * obtained from the register (or verify-otp) response.
 *
 * Only the fields supported by the current API spec are sent:
 * first_name, last_name, username, gender, has_accepted_terms.
 * Additional wizard fields (birthday, location, profile picture) are collected
 * locally and will be sent when the API supports them.
 */
export const createProfile = async (
  formData: RegistrationFormData,
  accessToken: string
): Promise<ProfileApiResult> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/profiles/me`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        first_name: formData.firstName,
        last_name: formData.lastName,
        username: formData.username,
        gender: formData.gender,
        has_accepted_terms: true,
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        error: data?.message || `Profile creation failed (${response.status}).`,
      };
    }

    return { success: true };
  } catch {
    return { success: false, error: 'Network error. Please check your connection.' };
  }
};
