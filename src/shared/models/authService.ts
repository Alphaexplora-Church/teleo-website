// shared/models/authService.ts — Stubbed auth API functions (no React, no hooks)
// Swap these out for real backend calls when ready.

import type { LoginCredentials, AuthResult } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

/**
 * Authenticate a user with email/phone + password.
 * Currently stubbed — replace with real API call.
 */
export const loginWithEmail = async (
  credentials: LoginCredentials
): Promise<AuthResult> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.emailOrPhone,
        password: credentials.password,
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      if (response.status === 400) {
        return { success: false, error: data?.message || 'Invalid email format or password.' };
      }
      if (response.status === 401) {
        return { success: false, error: 'Invalid email or password.' };
      }
      return { success: false, error: data?.message || `Login failed (${response.status})` };
    }

    if (data?.data?.user && data?.data?.session) {
      // Store session tokens locally
      localStorage.setItem('access_token', data.data.session.access_token);
      if (data.data.session.refresh_token) {
        localStorage.setItem('refresh_token', data.data.session.refresh_token);
      }

      return {
        success: true,
        user: {
          id: data.data.user.id,
          email: data.data.user.email,
          displayName: data.data.user.email.split('@')[0],
          role: 'member',
        },
      };
    }

    return { success: false, error: 'Invalid response from server.' };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Network error. Please check your connection.' };
  }
};

/**
 * Initiate Google OAuth flow.
 * Currently stubbed — bind to your OAuth provider callback here.
 */
export const loginWithGoogle = async (): Promise<AuthResult> => {
  return new Promise((resolve) => {
    // TODO: Replace with actual Google OAuth provider SDK call
    setTimeout(() => {
      resolve({
        success: true,
        user: {
          id: 'stub-google-001',
          email: 'user@gmail.com',
          displayName: 'Google User',
          role: 'member',
        },
      });
    }, 600);
  });
};

/**
 * Skip authentication and proceed as an unauthenticated guest.
 */
export const continueAsGuest = async (): Promise<AuthResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        user: {
          id: 'guest',
          email: '',
          displayName: 'Guest',
          role: 'guest',
        },
      });
    }, 200);
  });
};

/**
 * Logout user.
 * Clears local tokens and invalidates session on server.
 */
export const logout = async (): Promise<void> => {
  const token = localStorage.getItem('access_token');
  
  // Regardless of API success, we clear the local state
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');

  if (token) {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Logout API failed:', error);
      // We still clear local state even if the network fails
    }
  }
};
