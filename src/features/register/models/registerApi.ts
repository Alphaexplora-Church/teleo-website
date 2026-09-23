// features/register/models/registerApi.ts
// Real API calls — pure TypeScript, no React, no hooks, no JSX

import type { RegistrationFormData, RegisterApiResult, ProfileApiResult } from './registerTypes';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
      credentials: 'include',
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
 * Converts the wizard's separate month/day/year fields into a single
 * ISO date string (YYYY-MM-DD) for the API. Returns null if any part
 * is missing, since birthdate is optional.
 */
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const toBirthdate = (data: RegistrationFormData): string | null => {
  if (!data.birthMonth || !data.birthDay || !data.birthYear) return null;
  const monthIndex = MONTHS.indexOf(data.birthMonth);
  if (monthIndex === -1) return null;
  const mm = String(monthIndex + 1).padStart(2, '0');
  const dd = String(data.birthDay).padStart(2, '0');
  return `${data.birthYear}-${mm}-${dd}`;
};

/**
 * POST /api/profiles/picture
 *
 * Uploads a profile picture and returns the hosted HTTPS URL.
 * Requires a valid Bearer JWT from the register response.
 */
export const uploadProfilePicture = async (
  file: File,
  accessToken: string
): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    const body = new FormData();
    body.append('image', file);

    const response = await fetch(`${API_BASE_URL}/api/profiles/picture`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        error: data?.message || `Image upload failed (${response.status}).`,
      };
    }

    return { success: true, url: data?.data?.url };
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
    const birthdate = toBirthdate(formData);
    const location = formData.location
      ? {
          formatted_address: formData.location.address,
          latitude: formData.location.lat,
          longitude: formData.location.lng,
        }
      : null;

    const response = await fetch(`${API_BASE_URL}/api/profiles/me`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        first_name: formData.firstName,
        last_name: formData.lastName,
        gender: formData.gender,
        has_accepted_terms: true,
        ...(birthdate !== null && { birthdate }),
        ...(location !== null && { location }),
        ...(formData.profilePictureUrl !== null && { profile_picture_url: formData.profilePictureUrl }),
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
