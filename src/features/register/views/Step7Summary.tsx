// features/register/views/Step7Summary.tsx
// View: Step 7 — Read-only profile review and final submission

import React from 'react';
import type { RegistrationFormData } from '../models/registerTypes';

// ── Check icon ────────────────────────────────────────────────
const CheckIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ── User placeholder icon ─────────────────────────────────────
const UserPlaceholderIcon: React.FC = () => (
  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-gray-border">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

// ── Gender label helper ───────────────────────────────────────
const genderLabel = (g: RegistrationFormData['gender']): string => {
  if (g === 'male') return 'Male';
  if (g === 'female') return 'Female';
  if (g === 'nonbinary') return 'Non-binary';
  return 'Not specified';
};

// ── Summary row ───────────────────────────────────────────────
interface SummaryRowProps {
  label: string;
  value: string;
  isProvided?: boolean;
}

const SummaryRow: React.FC<SummaryRowProps> = ({ label, value, isProvided = true }) => (
  <div className="flex items-start justify-between py-3.5 border-b border-gray-border/60 last:border-b-0 gap-4">
    <span className="text-[13px] font-medium text-gray-placeholder uppercase tracking-wider whitespace-nowrap shrink-0">{label}</span>
    <span className={`text-[15px] font-medium text-right leading-tight ${isProvided ? 'text-navy' : 'text-gray-placeholder italic'}`}>
      {value}
    </span>
  </div>
);

// ── Props ─────────────────────────────────────────────────────
interface Step7Props {
  formData: RegistrationFormData;
  errors: { general?: string };
  isLoading: boolean;
  onSubmit: () => void;
}

// ── Component ─────────────────────────────────────────────────
const Step7Summary: React.FC<Step7Props> = ({ formData, errors, isLoading, onSubmit }) => {
  const fullName = `${formData.firstName} ${formData.lastName}`.trim() || 'Not provided';
  const birthday = formData.birthMonth && formData.birthDay && formData.birthYear
    ? `${formData.birthMonth} ${formData.birthDay}, ${formData.birthYear}`
    : 'Not provided';
  const locationText = formData.location?.address || null;

  return (
    <div className="flex flex-col gap-0 w-full animate-page-fade-in">
      {/* ── Header ── */}
      <div className="flex flex-col items-center gap-2 mb-7 text-center">
        <h2 className="text-[24px] font-bold text-navy leading-tight">You're all set!</h2>
        <p className="text-[14px] text-gray-placeholder">Review your profile before completing registration.</p>
      </div>

      {/* ── Avatar ── */}
      <div className="flex justify-center mb-7">
        <div className="relative">
          <div className="w-[96px] h-[96px] rounded-full bg-[#e8ecef] border-[3px] border-white shadow-md flex items-center justify-center overflow-hidden">
            {formData.profilePictureUrl ? (
              <img
                src={formData.profilePictureUrl}
                alt={`${fullName} profile`}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserPlaceholderIcon />
            )}
          </div>
          {/* Completion badge */}
          <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-navy border-2 border-white flex items-center justify-center shadow-sm">
            <span className="text-white"><CheckIcon /></span>
          </div>
        </div>
      </div>

      {/* ── Metadata grid ── */}
      <div className="w-full rounded-2xl bg-white border border-gray-border/80 px-5 mb-7 shadow-sm">
        <SummaryRow label="Full Name" value={fullName} isProvided={!!(formData.firstName || formData.lastName)} />
        <SummaryRow label="Email" value={formData.email || 'Not provided'} isProvided={!!formData.email} />
        <SummaryRow label="Birthday" value={birthday} isProvided={!!(formData.birthMonth && formData.birthDay && formData.birthYear)} />
        <SummaryRow label="Gender" value={genderLabel(formData.gender)} isProvided={!!formData.gender} />
        <SummaryRow
          label="Location"
          value={locationText ?? 'Not provided'}
          isProvided={!!locationText}
        />
      </div>

      {/* ── General Error ── */}
      {errors.general && (
        <div className="w-full py-3 px-3.5 rounded-lg bg-error-bg text-error text-sm font-medium border border-red-600/20 mb-4" role="alert">
          {errors.general}
        </div>
      )}

      {/* ── Complete Registration CTA ── */}
      <button
        id="btn-reg-complete"
        type="button"
        onClick={onSubmit}
        disabled={isLoading}
        className="w-full min-h-[56px] flex items-center justify-center gap-2.5 rounded-full border-none bg-navy text-white font-sans text-[16px] font-bold tracking-[0.15px] cursor-pointer px-6 transition-all shadow-btn hover:bg-navy-hover hover:shadow-[0_4px_20px_rgba(27,50,82,0.35)] active:bg-navy-active active:scale-95 active:shadow-none disabled:opacity-60 disabled:cursor-not-allowed select-none"
      >
        {isLoading ? (
          <span className="inline-block w-5 h-5 border-[2.5px] border-white/40 border-t-white rounded-full animate-spin" aria-label="Submitting" />
        ) : (
          'Complete Registration'
        )}
      </button>
    </div>
  );
};

export default Step7Summary;
