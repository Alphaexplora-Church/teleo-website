// shared/models/authService.ts — Stubbed auth API functions (no React, no hooks)
// Swap these out for real backend calls when ready.

import type { LoginCredentials, AuthResult } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

// The access/refresh tokens live in httpOnly cookies now (JS can't read them),
// so we keep the signed-in user's id in memory for sync consumers like
// getCurrentUserId(). It's set on login and cleared on logout; on a hard page
// reload it's repopulated by ensureCurrentUserLoaded() via GET /api/auth/me.
let cachedUserId: string | null = null;
let pendingUserFetch: Promise<void> | null = null;

export const getCachedUserId = (): string | null => cachedUserId;

export const refreshCurrentUser = async (): Promise<string | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      credentials: 'include',
    });

    if (!response.ok) {
      cachedUserId = null;
      return null;
    }

    const json = await response.json();
    cachedUserId = json?.data?.id ?? null;
    return cachedUserId;
  } catch {
    return cachedUserId;
  }
};

/** Call once on app bootstrap to hydrate the in-memory user id from the session cookie. */
export const ensureCurrentUserLoaded = (): Promise<void> => {
  if (!pendingUserFetch) {
    pendingUserFetch = refreshCurrentUser()
      .then(() => undefined)
      .finally(() => {
        pendingUserFetch = null;
      });
  }
  return pendingUserFetch;
};

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
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
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

    const user = data?.data?.user || data?.data?.userProfile;
    const session = data?.data?.session;

    if (user) {
      if (session?.access_token) {
        localStorage.setItem('access_token', session.access_token);
        if (session.refresh_token) {
          localStorage.setItem('refresh_token', session.refresh_token);
        }
      }

      return {
        success: true,
        user: {
          id: user.id || user.uid || '',
          email: user.email || credentials.emailOrPhone,
          displayName: user.username || user.email?.split('@')[0] || 'Member',
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
  try {
    await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Logout API failed:', error);
    // Cookies are httpOnly — the server clears them; nothing local to clean up.
  } finally {
    cachedUserId = null;
  }
};
