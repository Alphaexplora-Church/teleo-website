// features/profile/security/change-email/views/ChangeEmailView.tsx
// View layer — dumb UI only. NO useState, NO useEffect, NO API calls.
// All state and logic is delegated to useChangeEmailViewModel.
//
// Renders the Change Email form: current email (read-only), new email input, Send Code button.

import React from 'react';
import { useChangeEmailViewModel } from '../viewModels/useChangeEmailViewModel';

// ── Props ──────────────────────────────────────────────────────────────────────

interface ChangeEmailViewProps {
  /** Callback triggered after the verification code is successfully sent. */
  onCodeSent?: (newEmail: string) => void;
}

// ── Local icons ────────────────────────────────────────────────────────────────

const SpinnerIcon: React.FC<{ colour?: string }> = ({ colour = 'white' }) => (
  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24"
    fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke={colour} strokeWidth="3"
      strokeLinecap="round" strokeDasharray="31.4 62.8" />
  </svg>
);

// ── Shared sub-components ──────────────────────────────────────────────────────

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

// ── View component ─────────────────────────────────────────────────────────────

const ChangeEmailView: React.FC<ChangeEmailViewProps> = ({ onCodeSent }) => {
  const {
    currentEmail,
    newEmail,
    isSendingCode,
    sendError,
    handleNewEmailChange,
    handleSendCode,
    handleDismissSendError,
  } = useChangeEmailViewModel({ onCodeSent });

  return (
    <main className="flex flex-col w-full items-center gap-6 relative min-h-full pt-6 pb-10">
      <div className="flex flex-col w-full gap-5 px-4 max-w-[448px]">

        {/* ── Hero text ──────────────────────────────────────────── */}
        <section className="flex flex-col gap-1">
          <h1 className="text-black text-2xl font-bold font-sans leading-6">
            Change Email Address
          </h1>
          <p className="text-black/70 text-sm font-normal font-sans leading-5">
            Enter your new email address below. We'll send a verification code to confirm it.
          </p>
        </section>

        {/* ── Error banner ───────────────────────────────────────── */}
        {sendError && (
          <FeedbackBanner type="error" message={sendError} onDismiss={handleDismissSendError} />
        )}

        {/* ── Fields ─────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3 w-full">

          {/* Current email — read-only */}
          <div className="flex flex-col gap-[3px]">
            <label
              htmlFor="current-email"
              className="text-black text-sm font-medium font-sans leading-6"
            >
              Current Email Address
            </label>
            <div
              id="current-email"
              aria-label="Current email address"
              className={[
                'w-full h-11 px-4 py-2.5',
                'flex items-center justify-left',
                'bg-blue-500/5 rounded-[10px]',
                'outline outline-1 outline-offset-[-1px] outline-[#1f2156]',
                'text-black text-xs font-normal font-sans leading-4',
                'opacity-60 select-none',
              ].join(' ')}
            >
              {currentEmail}
            </div>
          </div>

          {/* New email — editable */}
          <div className="flex flex-col gap-[3px]">
            <label
              htmlFor="new-email"
              className="text-black text-sm font-medium font-sans leading-6"
            >
              New Email Address
            </label>
            <input
              id="new-email"
              type="email"
              value={newEmail}
              placeholder="newemail@example.com"
              disabled={isSendingCode}
              autoComplete="email"
              onChange={(e) => handleNewEmailChange(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSendCode(); }}
              className={[
                'w-full h-11 px-4 py-2.5',
                'bg-blue-500/5 rounded-[10px]',
                'outline outline-1 outline-offset-[-1px] outline-[#1f2156]',
                'text-black text-xs font-normal font-sans leading-4',
                'placeholder:text-gray-400',
                'focus:outline-2 focus:outline-[#336ef9]',
                'transition-all duration-150',
                isSendingCode ? 'opacity-60 cursor-not-allowed' : 'cursor-text',
              ].join(' ')}
            />
          </div>
        </div>

        {/* ── Send Code button ───────────────────────────────────── */}
        <button
          type="button"
          id="btn-send-verification-code"
          onClick={handleSendCode}
          disabled={isSendingCode || !newEmail.trim()}
          aria-label="Send verification code"
          className={[
            'w-full h-14 px-4',
            'bg-[#336ef9]/30 rounded-[20px]',
            'shadow-[0px_4px_4px_rgba(0,0,0,0.25)]',
            'border border-[#1f2156]',
            'flex items-center justify-center gap-2',
            'text-black text-sm font-bold font-sans leading-4',
            'hover:bg-[#336ef9]/40 hover:scale-[1.01] hover:shadow-md',
            'active:scale-[0.99]',
            'transition-all duration-200',
            isSendingCode || !newEmail.trim()
              ? 'opacity-50 cursor-not-allowed'
              : 'cursor-pointer',
          ].join(' ')}
        >
          {isSendingCode ? (
            <>
              <SpinnerIcon colour="#1f2156" />
              Sending…
            </>
          ) : (
            'Send Verification Code'
          )}
        </button>

      </div>
    </main>
  );
};

export default ChangeEmailView;
