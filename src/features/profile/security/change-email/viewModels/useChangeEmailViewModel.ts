// features/profile/security/change-email/viewModels/useChangeEmailViewModel.ts
// ViewModel layer — owns ALL useState, handlers, and derived state for changing email (Step 1).
// NO JSX. Returns exactly what the ChangeEmailView needs.

import { useState, useCallback } from 'react';
import { sendVerificationCode } from '../models/changeEmailApi';
import { STATIC_CURRENT_EMAIL, EMAIL_REGEX } from '../models/changeEmailTypes';

// ── Options ────────────────────────────────────────────────────────────────────

export interface ChangeEmailViewModelOptions {
  /** Called after the verification code is successfully sent, passing the new email. */
  onCodeSent?: (newEmail: string) => void;
}

// ── Return type ────────────────────────────────────────────────────────────────

export interface ChangeEmailViewModelReturn {
  currentEmail: string;
  newEmail: string;
  isSendingCode: boolean;
  sendError: string | null;

  handleNewEmailChange: (value: string) => void;
  handleSendCode: () => Promise<void>;
  handleDismissSendError: () => void;
}

// ── Hook ───────────────────────────────────────────────────────────────────────

export const useChangeEmailViewModel = ({
  onCodeSent,
}: ChangeEmailViewModelOptions = {}): ChangeEmailViewModelReturn => {

  const [newEmail, setNewEmail] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const handleNewEmailChange = useCallback((value: string) => {
    setNewEmail(value);
    setSendError(null);
  }, []);

  const handleSendCode = useCallback(async () => {
    if (isSendingCode) return;

    const trimmed = newEmail.trim();
    if (!trimmed) {
      setSendError('Please enter a new email address.');
      return;
    }
    if (!EMAIL_REGEX.test(trimmed)) {
      setSendError('Please enter a valid email address.');
      return;
    }
    if (trimmed.toLowerCase() === STATIC_CURRENT_EMAIL.toLowerCase()) {
      setSendError('New email must be different from your current email.');
      return;
    }

    setSendError(null);
    setIsSendingCode(true);
    try {
      await sendVerificationCode(trimmed);
      onCodeSent?.(trimmed);
    } catch (err) {
      setSendError(
        err instanceof Error ? err.message : 'Failed to send code. Please try again.',
      );
    } finally {
      setIsSendingCode(false);
    }
  }, [isSendingCode, newEmail, onCodeSent]);

  const handleDismissSendError = useCallback(() => setSendError(null), []);

  return {
    currentEmail: STATIC_CURRENT_EMAIL,
    newEmail,
    isSendingCode,
    sendError,
    handleNewEmailChange,
    handleSendCode,
    handleDismissSendError,
  };
};
