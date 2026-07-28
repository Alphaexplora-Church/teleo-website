// features/profile/security/change-number/viewModels/useChangeNumberViewModel.ts
// ViewModel layer — owns ALL useState, handlers, and derived state.
// NO JSX. Returns exactly what ChangeNumberView needs.

import { useState, useCallback } from 'react';
import { sendOtpCode } from '../models/changeNumberApi';
import {
  STATIC_CURRENT_PHONE_NUMBER,
  COUNTRY_CODES,
} from '../models/changeNumberTypes';
import type { CountryCodeOption } from '../models/changeNumberTypes';

// ── Options ────────────────────────────────────────────────────────────────────

export interface ChangeNumberViewModelOptions {
  /** Called after the OTP code is successfully sent, passing the formatted phone number. */
  onOtpSent?: (formattedNumber: string) => void;
}

// ── Return type ────────────────────────────────────────────────────────────────

export interface ChangeNumberViewModelReturn {
  currentPhoneNumber: string;
  countryCode: string;
  newPhoneNumber: string;
  isSendingOtp: boolean;
  sendError: string | null;
  countryCodes: readonly CountryCodeOption[];

  handleCountryCodeChange: (value: string) => void;
  handleNewNumberChange: (value: string) => void;
  handleSendOtp: () => Promise<void>;
  handleDismissSendError: () => void;
}

// ── Hook ───────────────────────────────────────────────────────────────────────

export const useChangeNumberViewModel = ({
  onOtpSent,
}: ChangeNumberViewModelOptions = {}): ChangeNumberViewModelReturn => {

  const [countryCode, setCountryCode] = useState('+63');
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const handleCountryCodeChange = useCallback((value: string) => {
    setCountryCode(value);
    setSendError(null);
  }, []);

  const handleNewNumberChange = useCallback((value: string) => {
    // Keep only digits and spaces/hyphens for input formatting comfort
    const cleaned = value.replace(/[^\d]/g, '');
    setNewPhoneNumber(cleaned);
    setSendError(null);
  }, []);

  const handleSendOtp = useCallback(async () => {
    if (isSendingOtp) return;

    const trimmedNumber = newPhoneNumber.trim();
    if (!trimmedNumber) {
      setSendError('Please enter a new phone number.');
      return;
    }

    // Prepend the selected country code digits (e.g. "63" from "+63")
    const numericCc = countryCode.replace(/[^\d]/g, '');
    const combinedNumber = `${numericCc}${trimmedNumber}`;

    // Validate the combined number (e.g. starting with 639 followed by 9 digits)
    const validationRegex = new RegExp(`^${numericCc}9\\d{9}$`);
    if (!validationRegex.test(combinedNumber)) {
      setSendError('Please enter a valid 10-digit number starting with 9.');
      return;
    }

    // Normalize values to only digits for accurate comparison
    const cleanCurrent = STATIC_CURRENT_PHONE_NUMBER.replace(/[^\d]/g, '');
    const cleanNew = combinedNumber;

    if (cleanCurrent === cleanNew) {
      setSendError('New phone number must be different from your current number.');
      return;
    }

    setSendError(null);
    setIsSendingOtp(true);
    try {
      await sendOtpCode(countryCode, trimmedNumber);
      onOtpSent?.(`${countryCode} ${trimmedNumber}`);
    } catch (err) {
      setSendError(
        err instanceof Error ? err.message : 'Failed to send OTP code. Please try again.',
      );
    } finally {
      setIsSendingOtp(false);
    }
  }, [isSendingOtp, countryCode, newPhoneNumber, onOtpSent]);

  const handleDismissSendError = useCallback(() => setSendError(null), []);

  return {
    currentPhoneNumber: STATIC_CURRENT_PHONE_NUMBER,
    countryCode,
    newPhoneNumber,
    isSendingOtp,
    sendError,
    countryCodes: COUNTRY_CODES,
    handleCountryCodeChange,
    handleNewNumberChange,
    handleSendOtp,
    handleDismissSendError,
  };
};
