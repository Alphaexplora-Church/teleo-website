// shared/models/authService.ts — Stubbed auth API functions (no React, no hooks)
// Swap these out for real backend calls when ready.

import type { LoginCredentials, AuthResult } from './types';

/**
 * Authenticate a user with email/phone + password.
 * Currently stubbed — replace with real API call.
 */
export const loginWithEmail = async (
  credentials: LoginCredentials
): Promise<AuthResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (credentials.emailOrPhone && credentials.password) {
        resolve({
          success: true,
          user: {
            id: 'stub-user-001',
            email: credentials.emailOrPhone,
            displayName: 'Teleo User',
            role: 'member',
          },
        });
      } else {
        resolve({ success: false, error: 'Invalid credentials.' });
      }
    }, 800);
  });
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
