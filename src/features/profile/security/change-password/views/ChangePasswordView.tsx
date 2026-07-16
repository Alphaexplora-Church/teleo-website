// features/profile/security/change-password/views/ChangePasswordView.tsx
// View layer — dumb UI only. NO useState, NO useEffect, NO API calls.
// All state and logic is delegated to useChangePasswordViewModel.

import React from 'react';
import { useChangePasswordViewModel } from '../viewModels/useChangePasswordViewModel';

// ── Props ──────────────────────────────────────────────────────────────────────

interface ChangePasswordViewProps {
  /** Callback triggered after the password is successfully changed. */
  onSuccess?: () => void;
}

// ── Local icons ────────────────────────────────────────────────────────────────

const SpinnerIcon: React.FC<{ colour?: string }> = ({ colour = 'white' }) => (
  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24"
    fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke={colour} strokeWidth="3"
      strokeLinecap="round" strokeDasharray="31.4 62.8" />
  </svg>
);

const EyeIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="#1f2156" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="#1f2156" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
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

const ChangePasswordView: React.FC<ChangePasswordViewProps> = ({ onSuccess }) => {
  const {
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
  } = useChangePasswordViewModel({ onSuccess });

  const isBusy = isSaving;

  return (
    <main className="flex flex-col w-full items-center gap-6 relative min-h-full pt-6 pb-10">
      <div className="flex flex-col w-full gap-5 px-4 max-w-[448px]">

        {/* ── Hero text ──────────────────────────────────────────── */}
        <section className="flex flex-col gap-1">
          <h1 className="text-black text-2xl font-bold font-sans leading-6">
            Change Password
          </h1>
          <p className="text-black/70 text-sm font-normal font-sans leading-5">
            Enter your new password below. Ensure it is at least 8 characters long.
          </p>
        </section>

        {/* ── Banners ────────────────────────────────────────────── */}
        {saveSuccess && (
          <FeedbackBanner type="success" message="Password changed successfully! 🎉" />
        )}
        {saveError && (
          <FeedbackBanner type="error" message={saveError} onDismiss={handleDismissSaveError} />
        )}

        {/* ── Fields ─────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3 w-full">

          {/* New password input */}
          <div className="flex flex-col gap-[3px]">
            <label
              htmlFor="new-password"
              className="text-black text-sm font-medium font-sans leading-6"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="new-password"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                placeholder="••••••••"
                disabled={isBusy || saveSuccess}
                onChange={(e) => handleNewPasswordChange(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
                className={[
                  'w-full h-11 pl-4 pr-11 py-2.5',
                  'bg-blue-500/5 rounded-[10px]',
                  'outline outline-1 outline-offset-[-1px] outline-[#1f2156]',
                  'text-black text-xs font-normal font-sans leading-4',
                  'placeholder:text-gray-400',
                  'focus:outline-2 focus:outline-[#336ef9]',
                  'transition-all duration-150',
                  isBusy || saveSuccess ? 'opacity-60 cursor-not-allowed' : 'cursor-text',
                ].join(' ')}
              />
              <button
                type="button"
                onClick={toggleShowNewPassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-1 rounded hover:bg-[#336ef9]/10 transition-colors focus:outline-none"
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {/* Retype new password input */}
          <div className="flex flex-col gap-[3px]">
            <label
              htmlFor="confirm-password"
              className="text-black text-sm font-medium font-sans leading-6"
            >
              Retype New Password
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                placeholder="••••••••"
                disabled={isBusy || saveSuccess}
                onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
                className={[
                  'w-full h-11 pl-4 pr-11 py-2.5',
                  'bg-blue-500/5 rounded-[10px]',
                  'outline outline-1 outline-offset-[-1px] outline-[#1f2156]',
                  'text-black text-xs font-normal font-sans leading-4',
                  'placeholder:text-gray-400',
                  'focus:outline-2 focus:outline-[#336ef9]',
                  'transition-all duration-150',
                  isBusy || saveSuccess ? 'opacity-60 cursor-not-allowed' : 'cursor-text',
                ].join(' ')}
              />
              <button
                type="button"
                onClick={toggleShowConfirmPassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-1 rounded hover:bg-[#336ef9]/10 transition-colors focus:outline-none"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

        </div>

        {/* ── Save Changes button ────────────────────────────────── */}
        <button
          type="button"
          id="btn-save-password"
          onClick={handleSave}
          disabled={isBusy || saveSuccess || !newPassword.trim() || !confirmPassword.trim()}
          aria-label="Save password changes"
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
            isBusy || saveSuccess || !newPassword.trim() || !confirmPassword.trim()
              ? 'opacity-50 cursor-not-allowed'
              : 'cursor-pointer',
          ].join(' ')}
        >
          {isBusy ? (
            <>
              <SpinnerIcon colour="#1f2156" />
              Saving…
            </>
          ) : (
            'Save Changes'
          )}
        </button>

      </div>
    </main>
  );
};

export default ChangePasswordView;
