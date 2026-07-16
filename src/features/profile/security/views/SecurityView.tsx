// features/profile/security/views/SecurityView.tsx
// View layer — dumb UI only. NO useState, NO useEffect, NO API calls.
// All state and logic is delegated to useSecurityViewModel.

import React from 'react';
import { useSecurityViewModel } from '../viewModels/useSecurityViewModel';
import type { SecurityActionItem, SecurityActionId } from '../models/securityTypes';

// ── Icons ──────────────────────────────────────────────────────────────────────

const EmailIcon: React.FC = () => (
  <svg width="18" height="16" viewBox="0 0 24 20" fill="none" stroke="#1f2156"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="16" rx="2" />
    <polyline points="2,2 12,13 22,2" />
  </svg>
);

const PasswordIcon: React.FC = () => (
  <svg width="16" height="18" viewBox="0 0 22 26" fill="none" stroke="#1f2156"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="11" width="16" height="13" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    <circle cx="11" cy="17" r="1.5" fill="#1f2156" />
  </svg>
);

const PhoneIcon: React.FC = () => (
  <svg width="16" height="18" viewBox="0 0 20 24" fill="none" stroke="#1f2156"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="16" height="20" rx="3" />
    <line x1="8" y1="19" x2="12" y2="19" strokeWidth="2.5" />
  </svg>
);

const ShieldIcon: React.FC = () => (
  <svg width="16" height="18" viewBox="0 0 22 26" fill="none" stroke="#1f2156"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 2L3 6v6c0 5.5 3.3 10.7 8 13 4.7-2.3 8-7.5 8-13V6L11 2z" />
  </svg>
);

const TrashIcon: React.FC<{ colour?: string }> = ({ colour = '#ff0000' }) => (
  <svg width="16" height="18" viewBox="0 0 22 24" fill="none" stroke={colour}
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="3 6 5 6 19 6" />
    <path d="M17 6l-1 14H6L5 6" />
    <path d="M9 11v6M13 11v6" />
    <path d="M8 6V4h6v2" />
  </svg>
);

const ChevronRight: React.FC<{ colour?: string }> = ({ colour = '#1f2156' }) => (
  <svg width="6" height="11" viewBox="0 0 8 13" fill="none" aria-hidden="true">
    <polyline points="1 1 7 6.5 1 12" stroke={colour} strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ICON_MAP: Record<SecurityActionItem['iconType'], React.ReactNode> = {
  email: <EmailIcon />,
  password: <PasswordIcon />,
  phone: <PhoneIcon />,
  shield: <ShieldIcon />,
  trash: <TrashIcon colour="#1f2156" />,
};

// ── Security row card ──────────────────────────────────────────────────────────
interface SecurityRowProps {
  item: SecurityActionItem;
  disabled?: boolean;
  onPress: (id: SecurityActionId) => void;
}
const SecurityRow: React.FC<SecurityRowProps> = ({ item, disabled = false, onPress }) => (
  <button
    type="button"
    id={`btn-security-${item.id}`}
    aria-label={item.label}
    disabled={disabled}
    onClick={() => onPress(item.id)}
    className={[
      'w-full h-14 pl-4 pr-3 pt-2 pb-2.5',
      'bg-[#336ef90d] rounded-[20px]',
      'shadow-[0px_4px_4px_rgba(0,0,0,0.25)]',
      'border border-[#1f2156]',
      'flex flex-col justify-center items-center',
      'text-left cursor-pointer',
      'hover:bg-[#336ef9]/10 hover:scale-[1.01]',
      'active:scale-[0.99]',
      'transition-all duration-200',
      disabled ? 'opacity-50 cursor-not-allowed' : '',
    ].join(' ')}
  >
    <div className="w-full relative inline-flex justify-start items-center gap-2">
      {/* Icon container */}
      <div className="size-8 bg-[#336ef9]/20 rounded-[10px] flex justify-center items-center shrink-0">
        {ICON_MAP[item.iconType]}
      </div>

      {/* Label + subtitle */}
      <div className="flex-1 min-w-0">
        <p className="text-black text-xs font-bold font-sans leading-4 truncate">
          {item.label}
        </p>
        {item.subtitle && (
          <p className="text-black/60 text-[10px] font-normal font-sans leading-4 truncate">
            {item.subtitle}
          </p>
        )}
      </div>

      {/* Chevron */}
      <ChevronRight />
    </div>
  </button>
);

// ── Delete confirmation modal ──────────────────────────────────────────────────
interface DeleteConfirmModalProps {
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}
const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ isDeleting, onConfirm, onCancel }) => (
  <div
    role="dialog"
    aria-modal="true"
    aria-labelledby="delete-confirm-title"
    className="fixed inset-0 z-[100] flex items-center justify-center px-6"
  >
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      onClick={onCancel}
      aria-hidden="true"
    />

    {/* Modal card */}
    <div className="relative w-full max-w-[340px] bg-white rounded-[20px] shadow-xl p-6 flex flex-col gap-5">
      {/* Danger icon */}
      <div className="flex justify-center">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <TrashIcon colour="#ff0000" />
        </div>
      </div>

      <div className="flex flex-col gap-2 text-center">
        <h2 id="delete-confirm-title" className="text-black text-lg font-bold font-sans leading-6">
          Delete Account?
        </h2>
        <p className="text-black/60 text-xs font-normal font-sans leading-5">
          This action is <strong className="text-black">permanent</strong> and cannot be undone.
          All your data, church connections, and activity will be erased.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          id="btn-confirm-delete-account"
          onClick={onConfirm}
          disabled={isDeleting}
          className={[
            'w-full h-12 rounded-[10px]',
            'bg-[#ff0000] text-white text-sm font-bold font-sans',
            'flex items-center justify-center gap-2',
            'hover:bg-red-600 active:scale-[0.98]',
            'transition-all duration-200',
            isDeleting ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
          ].join(' ')}
        >
          {isDeleting ? (
            <>
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24"
                fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3"
                  strokeLinecap="round" strokeDasharray="31.4 62.8" />
              </svg>
              Deleting…
            </>
          ) : (
            'Yes, Delete My Account'
          )}
        </button>

        <button
          type="button"
          id="btn-cancel-delete-account"
          onClick={onCancel}
          disabled={isDeleting}
          className={[
            'w-full h-12 rounded-[10px]',
            'bg-[#336ef90d] border border-[#1f2156]',
            'text-[#1f2156] text-sm font-medium font-sans',
            'hover:bg-[#336ef9]/10 active:scale-[0.98]',
            'transition-all duration-200',
            isDeleting ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
          ].join(' ')}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);

// ── Feedback banner ────────────────────────────────────────────────────────────
interface FeedbackBannerProps {
  message: string;
  onDismiss: () => void;
}
const ErrorBanner: React.FC<FeedbackBannerProps> = ({ message, onDismiss }) => (
  <div
    role="alert"
    aria-live="polite"
    className="flex items-center justify-between gap-2 w-full max-w-[371px] px-4 py-3
      rounded-[10px] text-sm font-sans bg-red-50 text-red-800 outline outline-1 outline-red-300
      transition-all duration-300"
  >
    <span>{message}</span>
    <button type="button" onClick={onDismiss} aria-label="Dismiss"
      className="shrink-0 text-current opacity-60 hover:opacity-100 transition-opacity">
      ✕
    </button>
  </div>
);

// ── View component ─────────────────────────────────────────────────────────────
interface SecurityViewProps {
  /** Called when the user taps the Change Email row. */
  onChangeEmail?: () => void;
  /** Called when the user taps the Change Phone Number row. */
  onChangeNumber?: () => void;
  /** Called when the user taps the Change Password row. */
  onChangePassword?: () => void;
  /** Called when the user taps the Privacy Policy row. */
  onChangePrivacyPolicy?: () => void;
}

const SecurityView: React.FC<SecurityViewProps> = ({ onChangeEmail, onChangeNumber, onChangePassword, onChangePrivacyPolicy }) => {
  const {
    credentialItems,
    privacyItems,
    dangerItems,
    showDeleteConfirm,
    isDeletingAccount,
    deleteError,
    handleActionPress,
    handleConfirmDelete,
    handleCancelDelete,
    handleDismissError,
  } = useSecurityViewModel({ onChangeEmail, onChangeNumber, onChangePassword, onChangePrivacyPolicy });

  return (
    <main className="flex flex-col w-full items-center gap-6 relative min-h-full pt-6 pb-10">
      <div className="flex flex-col w-full items-start gap-6 px-4 max-w-[448px]">

        {/* ── Hero text ──────────────────────────────────────── */}
        <section aria-labelledby="security-heading" className="flex flex-col gap-1 w-full">
          <h1
            id="security-heading"
            className="text-black text-2xl font-bold font-sans leading-6"
          >
            Protect Your Account
          </h1>
          <p className="text-black/70 text-sm font-normal font-sans leading-5">
            Manage your credentials and security preferences to keep your information safe.
          </p>
        </section>

        {/* ── Error banner ───────────────────────────────────── */}
        {deleteError && (
          <ErrorBanner message={deleteError} onDismiss={handleDismissError} />
        )}

        {/* ── Credentials section ────────────────────────────── */}
        <section
          aria-labelledby="credentials-heading"
          className="flex flex-col w-full gap-2.5"
        >
          <h2
            id="credentials-heading"
            className="text-[#757575] text-xl font-bold font-sans leading-6"
          >
            Account Credentials
          </h2>

          <div className="flex flex-col gap-2 w-full">
            {credentialItems.map((item) => (
              <SecurityRow
                key={item.id}
                item={item}
                disabled={isDeletingAccount}
                onPress={handleActionPress}
              />
            ))}
          </div>
        </section>

        {/* ── Data & Privacy section ─────────────────────────── */}
        <section
          aria-labelledby="privacy-heading"
          className="flex flex-col w-full gap-2.5"
        >
          <h2
            id="privacy-heading"
            className="text-[#757575] text-xl font-bold font-sans leading-6"
          >
            Data &amp; Privacy
          </h2>

          <div className="flex flex-col gap-2 w-full">
            {privacyItems.map((item) => (
              <SecurityRow
                key={item.id}
                item={item}
                disabled={isDeletingAccount}
                onPress={handleActionPress}
              />
            ))}
          </div>
        </section>

        {/* ── Danger zone ────────────────────────────────────── */}
        <section
          aria-labelledby="danger-heading"
          className="flex flex-col w-full gap-2.5"
        >
          {dangerItems.map((item) => (
            <button
              key={item.id}
              type="button"
              id={`btn-security-${item.id}`}
              aria-label={item.label}
              disabled={isDeletingAccount}
              onClick={() => handleActionPress(item.id)}
              className={[
                'w-full h-14 pl-4 pr-3 pt-2 pb-2.5',
                'bg-rose-300/90 rounded-[20px]',
                'shadow-[0px_4px_4px_rgba(0,0,0,0.25)]',
                'border border-[#1f2156]',
                'flex justify-center items-center',
                'hover:bg-rose-400/80 hover:scale-[1.01]',
                'active:scale-[0.99]',
                'transition-all duration-200',
                isDeletingAccount ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
              ].join(' ')}
            >
              <span className="text-black text-sm font-bold font-sans leading-4">
                {item.label}
              </span>
            </button>
          ))}
        </section>

      </div>

      {/* ── Delete confirmation modal ──────────────────────── */}
      {showDeleteConfirm && (
        <DeleteConfirmModal
          isDeleting={isDeletingAccount}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

    </main>
  );
};

export default SecurityView;