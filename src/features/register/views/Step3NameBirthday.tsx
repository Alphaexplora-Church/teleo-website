// features/register/views/Step3NameBirthday.tsx
// View: Step 3 — First Name, Last Name, Birthday (Month/Day/Year dropdowns)
// Condensed from two separate screens into one single page view.

import React from 'react';
import type { RegistrationFormData, RegistrationErrors } from '../models/registerTypes';

// ── Month / Day / Year data ───────────────────────────────────
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1));

const currentYear = new Date().getFullYear();
// Allow ages 13–120
const YEARS = Array.from({ length: 108 }, (_, i) => String(currentYear - 13 - i));

// ── Reusable text input ───────────────────────────────────────
interface TextInputProps {
  id: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  autoComplete?: string;
}

const TextInput: React.FC<TextInputProps> = ({ id, placeholder, value, onChange, error, autoComplete }) => (
  <div className="flex flex-col gap-1">
    <input
      id={id}
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      autoComplete={autoComplete}
      className={`w-full min-h-[52px] px-3.5 rounded-[10px] border-[1.5px] font-sans text-[15px] text-gray-label bg-white outline-none transition-all
        ${error
          ? 'border-error focus:border-error focus:shadow-[0_0_0_3px_rgba(220,38,38,0.10)]'
          : 'border-gray-border focus:border-navy focus:shadow-[0_0_0_3px_rgba(27,50,82,0.10)]'
        }`}
    />
    {error && <p className="text-xs text-error font-medium">{error}</p>}
  </div>
);

// ── Reusable select ───────────────────────────────────────────
interface SelectProps {
  id: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  error?: string;
}

const SelectInput: React.FC<SelectProps> = ({ id, placeholder, value, onChange, options, error }) => (
  <div className="flex flex-col gap-1 flex-1">
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full min-h-[52px] px-3 rounded-[10px] border-[1.5px] font-sans text-[15px] bg-white outline-none transition-all appearance-none cursor-pointer
        ${value ? 'text-gray-label' : 'text-gray-placeholder'}
        ${error
          ? 'border-error focus:border-error focus:shadow-[0_0_0_3px_rgba(220,38,38,0.10)]'
          : 'border-gray-border focus:border-navy focus:shadow-[0_0_0_3px_rgba(27,50,82,0.10)]'
        }`}
    >
      <option value="" disabled>{placeholder}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
    {error && <p className="text-xs text-error font-medium">{error}</p>}
  </div>
);

// ── Props ─────────────────────────────────────────────────────
interface Step3Props {
  formData: Pick<RegistrationFormData, 'firstName' | 'lastName' | 'birthMonth' | 'birthDay' | 'birthYear'>;
  errors: RegistrationErrors;
  isLoading: boolean;
  updateField: <K extends keyof RegistrationFormData>(key: K, value: RegistrationFormData[K]) => void;
  onSubmit: () => void;
}

// ── Component ─────────────────────────────────────────────────
const Step3NameBirthday: React.FC<Step3Props> = ({ formData, errors, isLoading, updateField, onSubmit }) => {
  return (
    <div className="flex flex-col gap-0 w-full animate-page-fade-in">

      {/* ── Name Section ── */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-[24px] font-bold text-navy leading-tight">Hello! What's your name?</h2>
        </div>

        <TextInput
          id="reg-first-name"
          placeholder="First Name"
          value={formData.firstName}
          onChange={(v) => updateField('firstName', v)}
          error={errors.firstName}
          autoComplete="given-name"
        />
        <TextInput
          id="reg-last-name"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(v) => updateField('lastName', v)}
          error={errors.lastName}
          autoComplete="family-name"
        />
      </div>

      {/* ── Divider ── */}
      <div className="flex items-center gap-3 mb-6">
        <span className="flex-1 h-px bg-gray-border" />
        <span className="text-[13px] text-gray-placeholder font-normal whitespace-nowrap">Birthday</span>
        <span className="flex-1 h-px bg-gray-border" />
      </div>

      {/* ── Birthday Section ── */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col gap-1">
          <h3 className="text-[20px] font-bold text-navy leading-tight">When's your birthday?</h3>
          <p className="text-[14px] text-gray-placeholder">We'd love to know!</p>
        </div>

        {/* Month / Day / Year dropdowns in a single row */}
        <div className="flex gap-2">
          <SelectInput
            id="reg-birth-month"
            placeholder="Month"
            value={formData.birthMonth}
            onChange={(v) => updateField('birthMonth', v)}
            options={MONTHS}
            error={errors.birthMonth}
          />
          <SelectInput
            id="reg-birth-day"
            placeholder="Day"
            value={formData.birthDay}
            onChange={(v) => updateField('birthDay', v)}
            options={DAYS}
            error={errors.birthDay}
          />
          <SelectInput
            id="reg-birth-year"
            placeholder="Year"
            value={formData.birthYear}
            onChange={(v) => updateField('birthYear', v)}
            options={YEARS}
            error={errors.birthYear}
          />
        </div>
      </div>

      {/* ── Next ── */}
      <button
        id="btn-reg-step3-next"
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

export default Step3NameBirthday;
