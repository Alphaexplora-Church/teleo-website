// features/services/booking/components/TimePicker.tsx
// Custom TimePicker component with number inputs for Hour, Minute, and AM/PM toggle buttons.

import React, { useState } from 'react';

export interface TimePickerValue {
  hour: number;
  minute: number;
  period: 'AM' | 'PM';
}

export interface TimePickerProps {
  initialHour?: number;
  initialMinute?: number;
  initialPeriod?: 'AM' | 'PM';
  onChange?: (time: TimePickerValue) => void;
  disabled?: boolean;
  error?: string;
}

// ── Chevron Icons for Up / Down ──────────────────────────────────────────────

const ChevronUpIcon: React.FC = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

const ChevronDownIcon: React.FC = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// ── Bounds Check Helper (8:00 AM to 5:00 PM) ─────────────────────────────────

const isValidBookingTime = (hour: number, minute: number, period: 'AM' | 'PM') => {
  // Convert to 24-hour format
  let h24 = hour % 12;
  if (period === 'PM') h24 += 12;

  const totalMinutes = h24 * 60 + minute;

  const startMinutes = 8 * 60;   // 8:00 AM
  const endMinutes = 17 * 60;    // 5:00 PM

  return totalMinutes >= startMinutes && totalMinutes <= endMinutes;
};

export const TimePicker: React.FC<TimePickerProps> = ({
  initialHour = 9,
  initialMinute = 0,
  initialPeriod = 'AM',
  onChange,
  disabled = false,
  error,
}) => {
  const [hour, setHour] = useState<number>(initialHour);
  const [minute, setMinute] = useState<number>(initialMinute);
  const [period, setPeriod] = useState<'AM' | 'PM'>(initialPeriod);

  const handleChange = (newHour: number, newMinute: number, newPeriod: 'AM' | 'PM') => {
    let clampedHour = Math.max(1, Math.min(12, newHour || 1));
    let clampedMinute = Math.max(0, Math.min(59, newMinute || 0));

    setHour(clampedHour);
    setMinute(clampedMinute);
    setPeriod(newPeriod);

    // 🔴 Add validation here
    if (!isValidBookingTime(clampedHour, clampedMinute, newPeriod)) {
      onChange?.({ hour: clampedHour, minute: clampedMinute, period: newPeriod });
      return;
    }

    // ✅ Only call onChange if valid
    onChange?.({ hour: clampedHour, minute: clampedMinute, period: newPeriod });
  };

  const handleIncrementHour = () => {
    const nextHour = hour >= 12 ? 1 : hour + 1;
    handleChange(nextHour, minute, period);
  };

  const handleDecrementHour = () => {
    const prevHour = hour <= 1 ? 12 : hour - 1;
    handleChange(prevHour, minute, period);
  };

  const handleIncrementMinute = () => {
    const nextMinute = (minute + 15) % 60;
    handleChange(hour, nextMinute, period);
  };

  const handleDecrementMinute = () => {
    const prevMinute = (minute - 15 + 60) % 60;
    handleChange(hour, prevMinute, period);
  };

  const isInvalid = !isValidBookingTime(hour, minute, period);
  const displayError = error || (isInvalid ? 'Time must be between 8:00 AM and 5:00 PM' : '');
  const hasError = Boolean(displayError);

  return (
    <div className="flex flex-col gap-2 items-center w-full">
      <div className="flex items-center gap-2 pt-1">
        {/* Hour input column */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            disabled={disabled}
            onClick={handleIncrementHour}
            aria-label="Increase hour"
            className="p-1 rounded-md text-black/50 hover:text-black hover:bg-black/5 active:scale-90 transition-all cursor-pointer disabled:opacity-30"
          >
            <ChevronUpIcon />
          </button>
          <input
            type="number"
            min={1}
            max={12}
            value={hour}
            disabled={disabled}
            onChange={(e) => handleChange(Number(e.target.value), minute, period)}
            className={`w-14 h-11 text-center rounded-xl text-black font-bold text-base font-['Poppins'] bg-white border outline-none focus:ring-2 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
              hasError
                ? 'border-red-500 focus:ring-red-500/20'
                : 'border-neutral-300 focus:ring-[#336ef9]/20'
            }`}
          />
          <button
            type="button"
            disabled={disabled}
            onClick={handleDecrementHour}
            aria-label="Decrease hour"
            className="p-1 rounded-md text-black/50 hover:text-black hover:bg-black/5 active:scale-90 transition-all cursor-pointer disabled:opacity-30"
          >
            <ChevronDownIcon />
          </button>
          <span className="text-[10px] font-medium text-black/40 font-['Roboto'] mt-0.5">Hour</span>
        </div>

        {/* Separator */}
        <span className="text-xl font-bold text-black font-['Poppins'] mb-4">:</span>

        {/* Minute input column */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            disabled={disabled}
            onClick={handleIncrementMinute}
            aria-label="Increase minute"
            className="p-1 rounded-md text-black/50 hover:text-black hover:bg-black/5 active:scale-90 transition-all cursor-pointer disabled:opacity-30"
          >
            <ChevronUpIcon />
          </button>
          <input
            type="number"
            min={0}
            max={59}
            step={15}
            value={minute < 10 ? `0${minute}` : minute}
            disabled={disabled}
            onChange={(e) => handleChange(hour, Number(e.target.value), period)}
            className={`w-14 h-11 text-center rounded-xl text-black font-bold text-base font-['Poppins'] bg-white border outline-none focus:ring-2 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
              hasError
                ? 'border-red-500 focus:ring-red-500/20'
                : 'border-neutral-300 focus:ring-[#336ef9]/20'
            }`}
          />
          <button
            type="button"
            disabled={disabled}
            onClick={handleDecrementMinute}
            aria-label="Decrease minute"
            className="p-1 rounded-md text-black/50 hover:text-black hover:bg-black/5 active:scale-90 transition-all cursor-pointer disabled:opacity-30"
          >
            <ChevronDownIcon />
          </button>
          <span className="text-[10px] font-medium text-black/40 font-['Roboto'] mt-0.5">Minute</span>
        </div>

        {/* AM/PM slider toggle */}
        <div
          className={`relative inline-flex p-1 bg-white border rounded-2xl select-none ml-2 mb-4 transition-colors ${
            hasError ? 'border-red-500' : 'border-neutral-300'
          }`}
        >
          {/* Sliding active pill background */}
          <div
            className={`absolute top-1 bottom-1 left-1 w-11 rounded-xl shadow-sm transition-all duration-200 ease-out ${
              hasError ? 'bg-red-600' : 'bg-[#1f2156]'
            } ${period === 'PM' ? 'translate-x-11' : 'translate-x-0'}`}
          />
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleChange(hour, minute, 'AM')}
            aria-pressed={period === 'AM'}
            className={`relative z-10 w-11 py-1.5 text-center text-xs font-bold font-['Poppins'] transition-colors duration-200 cursor-pointer ${
              period === 'AM' ? 'text-white' : 'text-black/60 hover:text-black'
            }`}
          >
            AM
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleChange(hour, minute, 'PM')}
            aria-pressed={period === 'PM'}
            className={`relative z-10 w-11 py-1.5 text-center text-xs font-bold font-['Poppins'] transition-colors duration-200 cursor-pointer ${
              period === 'PM' ? 'text-white' : 'text-black/60 hover:text-black'
            }`}
          >
            PM
          </button>
        </div>
      </div>

      {/* Validation Error Message */}
      {hasError && (
        <p className="text-red-600 text-xs font-medium font-['Roboto'] text-center pt-0.5">
          {displayError}
        </p>
      )}
    </div>
  );
};

export default TimePicker;
