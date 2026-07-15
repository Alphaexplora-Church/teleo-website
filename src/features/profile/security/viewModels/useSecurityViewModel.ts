// features/profile/security/viewModels/useSecurityViewModel.ts
// ViewModel layer — owns ALL useState, handlers, and derived state.
// NO JSX. Returns only what the View needs.

import { useState, useCallback } from 'react';
import { deleteUserAccount, SECURITY_ENDPOINTS } from '../models/securityApi';
import {
  SECURITY_CREDENTIAL_ITEMS,
  SECURITY_PRIVACY_ITEMS,
  SECURITY_DANGER_ITEMS,
} from '../models/securityTypes';
import type { SecurityActionId, SecurityActionItem } from '../models/securityTypes';

// ── ViewModel return type ──────────────────────────────────────────────────────

export interface SecurityViewModelReturn {
  // Section data
  credentialItems: readonly SecurityActionItem[];
  privacyItems: readonly SecurityActionItem[];
  dangerItems: readonly SecurityActionItem[];

  // Delete account flow
  showDeleteConfirm: boolean;
  isDeletingAccount: boolean;
  deleteError: string | null;

  // Handlers
  handleActionPress: (id: SecurityActionId) => void;
  handleConfirmDelete: () => Promise<void>;
  handleCancelDelete: () => void;
  handleDismissError: () => void;
}

// ── Hook ───────────────────────────────────────────────────────────────────────

export interface SecurityViewModelOptions {
  /** Called when the user taps the Change Email row. Provided by AppShell. */
  onChangeEmail?: () => void;
  /** Called when the user taps the Change Phone Number row. Provided by AppShell. */
  onChangeNumber?: () => void;
}

export const useSecurityViewModel = ({ onChangeEmail, onChangeNumber }: SecurityViewModelOptions = {}): SecurityViewModelReturn => {

  // ── Delete account state ───────────────────────────────────────
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // ── Action dispatcher ──────────────────────────────────────────
  // Routes each row press to the appropriate handler.
  // Future items (Change Email, Change Password, Change Phone) will navigate
  // to their own sub-pages via callbacks injected from the parent shell.
  const handleActionPress = useCallback((id: SecurityActionId) => {
    if (id === 'delete-account') {
      setShowDeleteConfirm(true);
      return;
    }

    if (id === 'privacy-policy') {
      window.open(SECURITY_ENDPOINTS.PRIVACY_POLICY_URL, '_blank', 'noopener,noreferrer');
      return;
    }

    if (id === 'change-email') {
      onChangeEmail?.();
      return;
    }

    if (id === 'change-phone') {
      onChangeNumber?.();
      return;
    }

    // Placeholder for future sub-page navigation
    console.info(`[Security] Navigate to: ${id}`);
  }, [onChangeEmail, onChangeNumber]);

  // ── Delete account ─────────────────────────────────────────────
  const handleConfirmDelete = useCallback(async () => {
    setIsDeletingAccount(true);
    setDeleteError(null);
    try {
      await deleteUserAccount();
      // In live mode: clear tokens and navigate to /welcome
      // localStorage.removeItem('access_token');
      // navigate('/welcome', { replace: true });
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : 'Failed to delete account. Please try again.',
      );
    } finally {
      setIsDeletingAccount(false);
      setShowDeleteConfirm(false);
    }
  }, []);

  const handleCancelDelete = useCallback(() => {
    setShowDeleteConfirm(false);
    setDeleteError(null);
  }, []);

  const handleDismissError = useCallback(() => {
    setDeleteError(null);
  }, []);

  return {
    credentialItems: SECURITY_CREDENTIAL_ITEMS,
    privacyItems: SECURITY_PRIVACY_ITEMS,
    dangerItems: SECURITY_DANGER_ITEMS,
    showDeleteConfirm,
    isDeletingAccount,
    deleteError,
    handleActionPress,
    handleConfirmDelete,
    handleCancelDelete,
    handleDismissError,
  };
};
