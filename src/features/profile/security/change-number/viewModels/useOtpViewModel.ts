// features/profile/security/change-number/viewModels/useOtpViewModel.ts
// ViewModel layer — owns ALL state, timers, and handlers for the OTP verification step.
// NO JSX. Returns exactly what OtpView needs.

import { useState, useCallback, useEffect, useRef } from 'react';
import { verifyOtpCode, resendOtpCode } from '../models/otpApi';
import { OTP_LENGTH, OTP_RESEND_SECONDS } from '../models/otpTypes';
import type { OtpDigits } from '../models/otpTypes';

// ── Options ────────────────────────────────────────────────────────────────────

export interface OtpViewModelOptions {
  /** The phone number the OTP was sent to. Provided by the parent shell. */
  targetNumber: string;
  /** Called after successful verification so the parent can update state/navigate. */
  onSuccess?: (confirmedNumber: string) => void;
}

// ── Return type ────────────────────────────────────────────────────────────────

export interface OtpViewModelReturn {
  targetNumber: string;
  digits: OtpDigits;
  isVerifying: boolean;
  isResending: boolean;
  verifyError: string | null;
  verifySuccess: boolean;
  resendCountdown: number;
  canResend: boolean;

  handleDigitChange: (index: number, value: string) => void;
  handleVerify: () => Promise<void>;
  handleResend: () => Promise<void>;
  handleDismissError: () => void;

  /** Refs for each OTP input cell — used by the View for auto-advance/retreat focus. */
  inputRefs: React.RefObject<HTMLInputElement | null>[];
}

// ── Hook ───────────────────────────────────────────────────────────────────────

export const useOtpViewModel = ({
  targetNumber,
  onSuccess,
}: OtpViewModelOptions): OtpViewModelReturn => {

  const [digits, setDigits] = useState<OtpDigits>(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [verifySuccess, setVerifySuccess] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(OTP_RESEND_SECONDS);
  const countdownRef = useRef<number | null>(null);

  // ── Digit input refs ───────────────────────────────────────────
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const inputRefs = Array.from({ length: OTP_LENGTH }, () => useRef<HTMLInputElement>(null));

  // ── Start countdown on mount ───────────────────────────────────
  const startCountdown = useCallback((initial = OTP_RESEND_SECONDS) => {
    if (countdownRef.current !== null) window.clearInterval(countdownRef.current);
    setResendCountdown(initial);
    countdownRef.current = window.setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          window.clearInterval(countdownRef.current!);
          countdownRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    startCountdown();
    return () => {
      if (countdownRef.current !== null) window.clearInterval(countdownRef.current);
    };
  }, [startCountdown]);

  // ── Handlers ───────────────────────────────────────────────────

  const handleDigitChange = useCallback((index: number, value: string) => {
    const char = value.replace(/\D/g, '').slice(-1);
    setDigits((prev) => {
      const next = [...prev] as OtpDigits;
      next[index] = char;
      return next;
    });
    setVerifyError(null);
    // Auto-advance focus on digit entry
    if (char && index < OTP_LENGTH - 1) {
      inputRefs[index + 1]?.current?.focus();
    }
  }, [inputRefs]);

  const handleVerify = useCallback(async () => {
    if (isVerifying) return;
    const code = digits.join('');
    if (code.length < OTP_LENGTH) {
      setVerifyError('Please enter the full 6-digit code.');
      return;
    }
    setVerifyError(null);
    setIsVerifying(true);
    try {
      const confirmed = await verifyOtpCode(targetNumber, code);
      setVerifySuccess(true);
      onSuccess?.(confirmed);
    } catch (err) {
      setVerifyError(
        err instanceof Error ? err.message : 'Verification failed. Please try again.',
      );
    } finally {
      setIsVerifying(false);
    }
  }, [isVerifying, digits, targetNumber, onSuccess]);

  const handleResend = useCallback(async () => {
    if (resendCountdown > 0 || isResending || isVerifying) return;
    setIsResending(true);
    setVerifyError(null);
    try {
      await resendOtpCode(targetNumber);
      setDigits(['', '', '', '', '', '']);
      startCountdown();
      inputRefs[0]?.current?.focus();
    } catch (err) {
      setVerifyError(
        err instanceof Error ? err.message : 'Failed to resend code. Please try again.',
      );
    } finally {
      setIsResending(false);
    }
  }, [resendCountdown, isResending, isVerifying, targetNumber, startCountdown, inputRefs]);

  const handleDismissError = useCallback(() => setVerifyError(null), []);

  return {
    targetNumber,
    digits,
    isVerifying,
    isResending,
    verifyError,
    verifySuccess,
    resendCountdown,
    canResend: resendCountdown === 0 && !isResending && !isVerifying,
    handleDigitChange,
    handleVerify,
    handleResend,
    handleDismissError,
    inputRefs,
  };
};
