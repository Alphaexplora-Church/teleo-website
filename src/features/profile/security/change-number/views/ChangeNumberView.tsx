// features/profile/security/change-number/views/ChangeNumberView.tsx
// View layer — dumb UI only. NO useState, NO useEffect, NO API calls.
// All state and logic is delegated to useChangeNumberViewModel.
//
// Renders the Change Phone Number form: current phone number (read-only), new country code dropdown,
// local number text input, and "Send OTP" button.
// Uses min-h-full for layout overflow optimization.

import React from 'react';
import { useChangeNumberViewModel } from '../viewModels/useChangeNumberViewModel';

// ── Props ──────────────────────────────────────────────────────────────────────

interface ChangeNumberViewProps {
  /** Callback triggered after the OTP code is successfully requested and sent. */
  onOtpSent?: (formattedNumber: string) => void;
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

const ChangeNumberView: React.FC<ChangeNumberViewProps> = ({ onOtpSent }) => {
  const {
    currentPhoneNumber,
    countryCode,
    newPhoneNumber,
    isSendingOtp,
    sendError,
    countryCodes,
    handleCountryCodeChange,
    handleNewNumberChange,
    handleSendOtp,
    handleDismissSendError,
  } = useChangeNumberViewModel({ onOtpSent });

  return (
    <main className="flex flex-col w-full items-center gap-6 relative min-h-full pt-6 pb-10">
      <div className="flex flex-col w-full gap-5 px-4 max-w-[448px]">

        {/* ── Hero text ──────────────────────────────────────────── */}
        <section className="flex flex-col gap-1">
          <h1 className="text-black text-2xl font-bold font-sans leading-6">
            Change Phone Number
          </h1>
          <p className="text-black/70 text-sm font-normal font-sans leading-5">
            Enter your new phone number below (e.g. 915 123 4567). We'll send an OTP to this number.
          </p>
        </section>

        {/* ── Error banner ───────────────────────────────────────── */}
        {sendError && (
          <FeedbackBanner type="error" message={sendError} onDismiss={handleDismissSendError} />
        )}

        {/* ── Fields ─────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3 w-full">

          {/* Current phone number — read-only */}
          <div className="flex flex-col gap-[3px]">
            <label
              htmlFor="current-phone"
              className="text-black text-sm font-medium font-sans leading-6"
            >
              Current Phone Number
            </label>
            <div
              id="current-phone"
              aria-label="Current phone number"
              className={[
                'w-full h-11 px-4 py-2.5',
                'flex items-center justify-left',
                'bg-blue-500/5 rounded-[10px]',
                'outline outline-1 outline-offset-[-1px] outline-blue-950',
                'text-black text-xs font-normal font-sans leading-4',
                'opacity-60 select-none',
              ].join(' ')}
            >
              {currentPhoneNumber}
            </div>
          </div>

          {/* Country Code dropdown + New local Phone Number input */}
          <div className="flex flex-col gap-[3px]">
            <div className="flex gap-4">
              {/* Country Code dropdown */}
              <div className="w-[190px] flex flex-col gap-[3px]">
                <label
                  htmlFor="country-code"
                  className="text-black text-sm font-medium font-sans leading-6 whitespace-nowrap"
                >
                  Country code
                </label>
                <div className="relative">
                  <select
                    id="country-code"
                    value={countryCode}
                    disabled={isSendingOtp}
                    onChange={(e) => handleCountryCodeChange(e.target.value)}
                    className={[
                      'w-full h-11 pl-3 pr-8 py-2.5',
                      'bg-blue-500/5 rounded-[10px]',
                      'outline outline-1 outline-offset-[-1px] outline-blue-950',
                      'text-black text-xs font-normal font-sans leading-4',
                      'appearance-none cursor-pointer',
                      'focus:outline-2 focus:outline-[#336ef9]',
                      'transition-all duration-150',
                    ].join(' ')}
                  >
                    {countryCodes.map((opt) => (
                      <option key={opt.code} value={opt.code}>
                        {opt.code === '+63' ? '+63 Philippines' : `${opt.code} (${opt.name})`}
                      </option>
                    ))}
                  </select>
                  {/* Custom dropdown triangle */}
                  <span
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-black text-[10px]"
                    aria-hidden="true"
                  >
                    ▼
                  </span>
                </div>
              </div>

              {/* New Local Number input */}
              <div className="flex-1 flex flex-col gap-[3px]">
                <label
                  htmlFor="new-phone"
                  className="text-black text-sm font-medium font-sans leading-6"
                >
                  New Phone Number
                </label>
                <input
                  id="new-phone"
                  type="tel"
                  value={newPhoneNumber}
                  placeholder="915 123 4567"
                  disabled={isSendingOtp}
                  onChange={(e) => handleNewNumberChange(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSendOtp(); }}
                  className={[
                    'w-full h-11 px-4 py-2.5',
                    'bg-blue-500/5 rounded-[10px]',
                    'outline outline-1 outline-offset-[-1px] outline-blue-950',
                    'text-black text-xs font-normal font-sans leading-4',
                    'placeholder:text-gray-400',
                    'focus:outline-2 focus:outline-[#336ef9]',
                    'transition-all duration-150',
                    isSendingOtp ? 'opacity-60 cursor-not-allowed' : 'cursor-text',
                  ].join(' ')}
                />
              </div>
            </div>
          </div>

        </div>

        {/* ── Send OTP button ────────────────────────────────────── */}
        <button
          type="button"
          id="btn-send-otp"
          onClick={handleSendOtp}
          disabled={isSendingOtp || !newPhoneNumber.trim()}
          aria-label="Send OTP code"
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
            isSendingOtp || !newPhoneNumber.trim()
              ? 'opacity-50 cursor-not-allowed'
              : 'cursor-pointer',
          ].join(' ')}
        >
          {isSendingOtp ? (
            <>
              <SpinnerIcon colour="#1f2156" />
              Sending…
            </>
          ) : (
            'Send OTP'
          )}
        </button>

      </div>
    </main>
  );
};

export default ChangeNumberView;
