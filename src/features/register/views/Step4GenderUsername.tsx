// features/register/views/Step4GenderUsername.tsx
// View: Step 4 — Gender identity selector + Username field
// Condensed from two separate screens into one single page view.

import React from 'react';
import type { RegistrationFormData, RegistrationErrors, GenderOption } from '../models/registerTypes';

// ── Gender Icon SVGs (inline, no external lib) ────────────────
const MaleIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="w-8 h-8">
    <circle cx="10" cy="14" r="5.5" stroke={active ? '#fff' : '#9ca3af'} strokeWidth="1.8" />
    <path d="M14.5 9.5L19 5M19 5h-4M19 5v4" stroke={active ? '#fff' : '#9ca3af'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FemaleIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="w-8 h-8">
    <circle cx="12" cy="9" r="5.5" stroke={active ? '#fff' : '#9ca3af'} strokeWidth="1.8" />
    <path d="M12 14.5v5M9.5 17h5" stroke={active ? '#fff' : '#9ca3af'} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const NonbinaryIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="w-8 h-8">
    <circle cx="12" cy="12" r="5.5" stroke={active ? '#fff' : '#9ca3af'} strokeWidth="1.8" />
    <path d="M12 6.5V2M9.5 4l2.5 2.5L14.5 4" stroke={active ? '#fff' : '#9ca3af'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 17.5V22M9.5 20l2.5-2.5L14.5 20" stroke={active ? '#fff' : '#9ca3af'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ── Gender options config ──────────────────────────────────────
const GENDER_OPTIONS: { value: GenderOption; label: string; Icon: React.FC<{ active: boolean }> }[] = [
  { value: 'male', label: 'Male', Icon: MaleIcon },
  { value: 'female', label: 'Female', Icon: FemaleIcon },
  { value: 'nonbinary', label: 'Non-binary', Icon: NonbinaryIcon },
];

// ── Props ─────────────────────────────────────────────────────
interface Step4Props {
  formData: Pick<RegistrationFormData, 'gender'>;
  errors: RegistrationErrors;
  isLoading: boolean;
  setGender: (gender: GenderOption) => void;
  updateField: <K extends keyof RegistrationFormData>(key: K, value: RegistrationFormData[K]) => void;
  onSubmit: () => void;
}

// ── Component ─────────────────────────────────────────────────
const Step4GenderUsername: React.FC<Step4Props> = ({
  formData, errors, isLoading, setGender, updateField, onSubmit,
}) => {
  return (
    <div className="flex flex-col gap-0 w-full animate-page-fade-in">

      {/* ── Gender Section ── */}
      <div className="flex flex-col gap-5 mb-8">
        <div className="flex flex-col gap-1">
          <h2 className="text-[24px] font-bold text-navy leading-tight">How do you identify as?</h2>
          <p className="text-[14px] text-gray-placeholder">We want to be respectful!</p>
        </div>

        {/* Gender buttons — 75% scale circular row */}
        <div className="flex items-center justify-center gap-5" role="radiogroup" aria-label="Gender identity">
          {GENDER_OPTIONS.map(({ value, label, Icon }) => {
            const isActive = formData.gender === value;
            return (
              <button
                key={value}
                id={`btn-gender-${value}`}
                type="button"
                role="radio"
                aria-checked={isActive}
                aria-label={label}
                onClick={() => setGender(value)}
                className={`flex flex-col items-center gap-2 group cursor-pointer border-none bg-transparent p-0 transition-transform active:scale-95`}
              >
                {/* Circle — 75% of original ~80px = 60px */}
                <div
                  className={`w-[60px] h-[60px] rounded-full flex items-center justify-center transition-all duration-200 shadow-md
                    ${isActive
                      ? 'bg-navy scale-105 shadow-[0_4px_16px_rgba(27,50,82,0.35)]'
                      : 'bg-[#9ca3af]/25 group-hover:bg-[#9ca3af]/40'
                    }`}
                >
                  <Icon active={isActive} />
                </div>
                <span className={`text-[11px] font-medium tracking-wide transition-colors ${isActive ? 'text-navy' : 'text-gray-placeholder'}`}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {errors.gender && (
          <p className="text-xs text-error font-medium text-center" role="alert">{errors.gender}</p>
        )}
      </div>

      {/* ── Next ── */}
      <button
        id="btn-reg-step4-next"
        type="button"
        onClick={onSubmit}
        disabled={isLoading}
        className="w-full min-h-[52px] flex items-center justify-center gap-2.5 rounded-full border-none bg-navy text-white font-sans text-[15px] font-semibold tracking-[0.1px] cursor-pointer px-6 transition-all shadow-btn hover:bg-navy-hover hover:shadow-[0_4px_16px_rgba(27,50,82,0.28)] active:bg-navy-active active:scale-95 active:shadow-none disabled:opacity-60 disabled:cursor-not-allowed select-none"
      >
        Next
      </button>
    </div>
  );
};

export default Step4GenderUsername;
