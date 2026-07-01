// features/register/views/Step1Credentials.tsx
// View: Step 1 — Email, Phone (Coming Soon), Password, Confirm Password

import React, { useState } from 'react';
import type { RegistrationFormData, RegistrationErrors } from '../models/registerTypes';

// ── Eye icons ─────────────────────────────────────────────────
const EyeOpenIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeClosedIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

// ── Reusable Input + Label + Error ────────────────────────────
interface FieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  autoComplete?: string;
  disabled?: boolean;
  rightSlot?: React.ReactNode;
}

const FormField: React.FC<FieldProps> = ({ id, label, type = 'text', placeholder, value, onChange, error, autoComplete, disabled, rightSlot }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-sm font-medium text-gray-label tracking-[0.03px]">
      {label}
    </label>
    <div className="relative flex items-center">
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        disabled={disabled}
        className={`w-full min-h-[52px] px-3.5 rounded-[10px] border-[1.5px] font-sans text-[15px] text-gray-label outline-none transition-all
          ${disabled
            ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed pointer-events-none select-none'
            : `bg-white ${error ? 'border-error focus:border-error focus:shadow-[0_0_0_3px_rgba(220,38,38,0.10)]' : 'border-gray-border focus:border-navy focus:shadow-[0_0_0_3px_rgba(27,50,82,0.10)]'}`
          }
          ${rightSlot ? 'pr-12' : ''}`}
      />
      {rightSlot && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
          {rightSlot}
        </div>
      )}
    </div>
    {error && <p className="text-xs text-error font-medium mt-0.5">{error}</p>}
  </div>
);

// ── Props ─────────────────────────────────────────────────────
interface Step1Props {
  formData: Pick<RegistrationFormData, 'email' | 'password' | 'confirmPassword'>;
  errors: RegistrationErrors;
  isLoading: boolean;
  updateField: <K extends keyof RegistrationFormData>(key: K, value: RegistrationFormData[K]) => void;
  onSubmit: () => void;
}

// ── Component ─────────────────────────────────────────────────
const Step1Credentials: React.FC<Step1Props> = ({ formData, errors, isLoading, updateField, onSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onSubmit();
  };

  return (
    <div className="flex flex-col gap-5 w-full animate-page-fade-in" onKeyDown={handleKeyDown}>
      {/* ── General Error ── */}
      {errors.general && (
        <div className="w-full py-3 px-3.5 rounded-lg bg-error-bg text-error text-sm font-medium border border-red-600/20" role="alert">
          {errors.general}
        </div>
      )}

      {/* ── Email ── */}
      <FormField
        id="reg-email"
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        value={formData.email}
        onChange={(v) => updateField('email', v)}
        error={errors.email}
        autoComplete="email"
      />

      {/* ── Phone — Coming Soon ── */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-400 tracking-[0.03px]">Phone Number</label>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[10px] font-semibold text-amber-600 tracking-wide uppercase leading-none">
            Coming Soon
          </span>
        </div>
        <input
          type="tel"
          placeholder="+1 (555) 000-0000"
          disabled
          aria-disabled="true"
          tabIndex={-1}
          className="w-full min-h-[52px] px-3.5 rounded-[10px] border-[1.5px] border-gray-200 bg-gray-50 font-sans text-[15px] text-gray-300 cursor-not-allowed pointer-events-none select-none outline-none"
        />
      </div>

      {/* ── Password ── */}
      <FormField
        id="reg-password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        placeholder="Min. 8 characters"
        value={formData.password}
        onChange={(v) => updateField('password', v)}
        error={errors.password}
        autoComplete="new-password"
        rightSlot={
          <button
            type="button"
            className="text-gray-placeholder p-1 rounded-md transition-colors hover:text-navy cursor-pointer border-none bg-transparent"
            onClick={() => setShowPassword((p) => !p)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
          </button>
        }
      />

      {/* ── Confirm Password ── */}
      <FormField
        id="reg-confirm-password"
        label="Confirm Password"
        type={showConfirm ? 'text' : 'password'}
        placeholder="Re-enter your password"
        value={formData.confirmPassword}
        onChange={(v) => updateField('confirmPassword', v)}
        error={errors.confirmPassword}
        autoComplete="new-password"
        rightSlot={
          <button
            type="button"
            className="text-gray-placeholder p-1 rounded-md transition-colors hover:text-navy cursor-pointer border-none bg-transparent"
            onClick={() => setShowConfirm((p) => !p)}
            aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
          >
            {showConfirm ? <EyeOpenIcon /> : <EyeClosedIcon />}
          </button>
        }
      />

      {/* ── Submit ── */}
      <button
        id="btn-reg-step1-next"
        type="button"
        onClick={onSubmit}
        disabled={isLoading}
        className="w-full min-h-[52px] flex items-center justify-center gap-2.5 rounded-full border-none bg-navy text-white font-sans text-[15px] font-semibold tracking-[0.1px] cursor-pointer px-6 transition-all shadow-btn hover:bg-navy-hover hover:shadow-[0_4px_16px_rgba(27,50,82,0.28)] active:bg-navy-active active:scale-95 active:shadow-none disabled:opacity-60 disabled:cursor-not-allowed select-none mt-2"
      >
        {isLoading ? (
          <span className="inline-block w-5 h-5 border-[2.5px] border-white/40 border-t-white rounded-full animate-spin" aria-label="Loading" />
        ) : (
          'Next'
        )}
      </button>
    </div>
  );
};

export default Step1Credentials;
