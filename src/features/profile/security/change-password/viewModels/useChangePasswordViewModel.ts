// features/profile/security/change-password/viewModels/useChangePasswordViewModel.ts
// ViewModel layer — owns ALL useState, handlers, and validation state for changing password.
// NO JSX. Returns exactly what the ChangePasswordView needs.

import { useState, useCallback } from 'react';
import { changePassword } from '../models/changePasswordApi';
import { MIN_PASSWORD_LENGTH } from '../models/changePasswordTypes';

// ── Options ────────────────────────────────────────────────────────────────────

export interface ChangePasswordViewModelOptions {
  /** Called after the password is successfully updated. */
  onSuccess?: () => void;
}

// ── Return type ────────────────────────────────────────────────────────────────

export interface ChangePasswordViewModelReturn {
  newPassword: string;
  confirmPassword: string;
  isSaving: boolean;
  saveError: string | null;
  saveSuccess: boolean;
  showNewPassword: boolean;
  showConfirmPassword: boolean;

  handleNewPasswordChange: (value: string) => void;
  handleConfirmPasswordChange: (value: string) => void;
  handleSave: () => Promise<void>;
  handleDismissSaveError: () => void;
  toggleShowNewPassword: () => void;
  toggleShowConfirmPassword: () => void;
}

// ── Hook ───────────────────────────────────────────────────────────────────────

export const useChangePasswordViewModel = ({
  onSuccess,
}: ChangePasswordViewModelOptions = {}): ChangePasswordViewModelReturn => {

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleNewPasswordChange = useCallback((value: string) => {
    setNewPassword(value);
    setSaveError(null);
  }, []);

  const handleConfirmPasswordChange = useCallback((value: string) => {
    setConfirmPassword(value);
    setSaveError(null);
  }, []);

  const toggleShowNewPassword = useCallback(() => {
    setShowNewPassword((prev) => !prev);
  }, []);

  const toggleShowConfirmPassword = useCallback(() => {
    setShowConfirmPassword((prev) => !prev);
  }, []);

  const handleSave = useCallback(async () => {
    if (isSaving) return;

    const trimmedPassword = newPassword.trim();
    const trimmedConfirm = confirmPassword.trim();

    if (!trimmedPassword) {
      setSaveError('Please enter a new password.');
      return;
    }

    if (trimmedPassword.length < MIN_PASSWORD_LENGTH) {
      setSaveError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`);
      return;
    }

    if (!trimmedConfirm) {
      setSaveError('Please retype your new password to confirm.');
      return;
    }

    if (trimmedPassword !== trimmedConfirm) {
      setSaveError('Passwords do not match.');
      return;
    }

    setSaveError(null);
    setIsSaving(true);
    try {
      await changePassword(trimmedPassword);
      setSaveSuccess(true);
      onSuccess?.();
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : 'Failed to save changes. Please try again.',
      );
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, newPassword, confirmPassword, onSuccess]);

  const handleDismissSaveError = useCallback(() => setSaveError(null), []);

  return {
    newPassword,
    confirmPassword,
    isSaving,
    saveError,
    saveSuccess,
    showNewPassword,
    showConfirmPassword,
    handleNewPasswordChange,
    handleConfirmPasswordChange,
    handleSave,
    handleDismissSaveError,
    toggleShowNewPassword,
    toggleShowConfirmPassword,
  };
};
