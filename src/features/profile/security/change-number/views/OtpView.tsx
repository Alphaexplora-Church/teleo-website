// features/profile/security/change-number/views/OtpView.tsx
// View layer — dumb UI only. NO useState (except local), NO useEffect, NO API calls.
// All state and logic is delegated to useOtpViewModel.

import React from 'react';
import { useOtpViewModel } from '../viewModels/useOtpViewModel';

// ── Props ──────────────────────────────────────────────────────────────────────

interface OtpViewProps {
  /** The phone number the OTP was sent to. Passed in by the shell. */
  targetNumber: string;
  /** Called after the code is successfully verified. */
  onSuccess?: (confirmedNumber: string) => void;
}

// ── Icons ──────────────────────────────────────────────────────────────────────

const PhoneIcon: React.FC = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="#1f2156" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="3" />
  </svg>
);

const SpinnerIcon: React.FC<{ colour?: string }> = ({ colour = 'white' }) => (
  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24"
    fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke={colour} strokeWidth="3"
      strokeLinecap="round" strokeDasharray="31.4 62.8" />
  </svg>
);

// ── Feedback banner ────────────────────────────────────────────────────────────

interface FeedbackBannerProps {
  type: 'success' | 'error';
  message: string;
  onDismiss?: () => void;
}
const FeedbackBanner: React.FC<FeedbackBannerProps> = ({ type, message, onDismiss }) => (
  <div
    role="alert"
    aria-live="polite"
    className={[
      'flex items-center justify-between gap-2 w-full px-4 py-3',
      'rounded-[10px] text-sm font-sans transition-all duration-300',
      type === 'success'
        ? 'bg-green-50 text-green-800 outline outline-1 outline-green-300'
        : 'bg-red-50 text-red-800 outline outline-1 outline-red-300',
    ].join(' ')}
  >
    <span>{message}</span>
    {onDismiss && (
      <button type="button" onClick={onDismiss} aria-label="Dismiss"
        className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
        ✕
      </button>
    )}
  </div>
);

// ── View ───────────────────────────────────────────────────────────────────────

const OtpView: React.FC<OtpViewProps> = ({ targetNumber, onSuccess }) => {
  const vm = useOtpViewModel({ targetNumber, onSuccess });

  const isBusy = vm.isVerifying || vm.isResending;

  // Backspace auto-retreat: focus previous cell when current cell is empty.
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !vm.digits[index] && index > 0) {
      vm.inputRefs[index - 1]?.current?.focus();
    }
  };

  return (
    <main className="flex flex-col w-full items-center gap-6 relative min-h-full pt-6 pb-10">
      <div className="flex flex-col w-full items-center gap-5 px-4">

        {/* ── Card ────────────────────────────────────────────── */}
        <div className="w-full rounded-[20px] bg-black/5 flex flex-col items-center gap-6 px-6 pt-10 pb-8">

          {/* Phone badge */}
          <div className="w-14 h-14 rounded-full bg-[#336ef9]/20 flex items-center justify-center shrink-0">
            <PhoneIcon />
          </div>

          {/* Title + subtitle */}
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-black text-2xl font-bold font-sans leading-6">
              Verify OTP
            </h1>
            <p className="text-black/60 text-sm font-normal font-sans leading-5">
              Enter the 6-digit code sent to{' '}
              <span className="text-black font-medium break-all">{targetNumber}</span>
            </p>
          </div>

          {/* ── Feedback banners ───────────────────────────────── */}
          {vm.verifySuccess && (
            <FeedbackBanner type="success" message="Phone number changed successfully! 🎉" />
          )}
          {vm.verifyError && (
            <FeedbackBanner
              type="error"
              message={vm.verifyError}
              onDismiss={vm.handleDismissError}
            />
          )}

          {/* ── OTP digit grid ─────────────────────────────────── */}
          <div
            className="flex items-center gap-2.5"
            role="group"
            aria-label="Verification code input"
          >
            {vm.digits.map((digit, i) => (
              <input
                key={i}
                ref={vm.inputRefs[i]}
                id={`otp-digit-${i}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                disabled={isBusy || vm.verifySuccess}
                aria-label={`Digit ${i + 1}`}
                onChange={(e) => vm.handleDigitChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={[
                  'w-11 h-12 rounded-[10px] text-center',
                  'text-black text-3xl font-medium font-sans',
                  'outline outline-1 outline-[#e5e5e5]',
                  'focus:outline-2 focus:outline-[#336ef9]',
                  'bg-white caret-transparent',
                  'transition-all duration-150',
                  digit ? 'outline-[#1f2156]' : '',
                  isBusy || vm.verifySuccess ? 'opacity-60 cursor-not-allowed' : 'cursor-text',
                ].join(' ')}
              />
            ))}
          </div>

          {/* ── Verify button ──────────────────────────────────── */}
          <button
            type="button"
            id="btn-verify-otp-code"
            onClick={vm.handleVerify}
            disabled={isBusy || vm.verifySuccess}
            aria-label="Verify code"
            className={[
              'w-56 h-10 rounded-[10px]',
              'bg-[#001739] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]',
              'flex items-center justify-center gap-2',
              'text-white text-sm font-bold font-sans leading-4',
              'hover:bg-[#0a2b58] hover:scale-[1.02]',
              'active:scale-[0.98]',
              'transition-all duration-200',
              isBusy || vm.verifySuccess ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
            ].join(' ')}
          >
            {vm.isVerifying ? (
              <>
                <SpinnerIcon />
                Verifying…
              </>
            ) : (
              'Verify Code'
            )}
          </button>

          {/* ── Resend countdown ───────────────────────────────── */}
          <p className="text-sm font-sans text-center">
            <span className="text-black/50">Didn't receive a code? </span>
            {vm.canResend ? (
              <button
                type="button"
                id="btn-resend-code"
                onClick={vm.handleResend}
                disabled={isBusy}
                className="text-[#336ef9] font-medium hover:underline transition-opacity disabled:opacity-40"
              >
                {vm.isResending ? 'Resending…' : 'Resend code'}
              </button>
            ) : (
              <span className="text-[#336ef9] font-medium">
                Resend in 0:{String(vm.resendCountdown).padStart(2, '0')}
              </span>
            )}
          </p>

        </div>
      </div>
    </main>
  );
};

export default OtpView;
