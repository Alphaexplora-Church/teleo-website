// features/register/views/Step2OtpVerify.tsx
// View: Step 2 — 6-digit OTP input with auto-focus shift and auto-verify on completion

import React, { useRef, useEffect, useCallback } from 'react';

interface Step2Props {
  email: string;
  otpCode: string;
  setOtpCode: (code: string) => void;
  error?: string;
  isLoading: boolean;
  onVerify: () => void;
}

const OTP_LENGTH = 6;

const Step2OtpVerify: React.FC<Step2Props> = ({ email, otpCode, setOtpCode, error, isLoading, onVerify }) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = otpCode.padEnd(OTP_LENGTH, '').split('').slice(0, OTP_LENGTH);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Auto-verify when all 6 digits are filled
  useEffect(() => {
    if (otpCode.length === OTP_LENGTH && !isLoading) {
      onVerify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otpCode]);

  const handleChange = useCallback(
    (index: number, value: string) => {
      // Only accept digits
      const digit = value.replace(/\D/g, '').slice(-1);
      const arr = otpCode.padEnd(OTP_LENGTH, ' ').split('');
      arr[index] = digit;
      const next = arr.join('').replace(/ /g, '');
      setOtpCode(next.slice(0, OTP_LENGTH));

      // Advance focus
      if (digit && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [otpCode, setOtpCode]
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace') {
        e.preventDefault();
        const arr = otpCode.padEnd(OTP_LENGTH, ' ').split('');
        if (arr[index] && arr[index] !== ' ') {
          arr[index] = ' ';
          setOtpCode(arr.join('').replace(/ /g, '').slice(0, OTP_LENGTH));
        } else if (index > 0) {
          inputRefs.current[index - 1]?.focus();
          const arr2 = otpCode.padEnd(OTP_LENGTH, ' ').split('');
          arr2[index - 1] = ' ';
          setOtpCode(arr2.join('').replace(/ /g, '').slice(0, OTP_LENGTH));
        }
      } else if (e.key === 'ArrowLeft' && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [otpCode, setOtpCode]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
      setOtpCode(pasted);
      // Focus the last filled or next empty slot
      const nextIdx = Math.min(pasted.length, OTP_LENGTH - 1);
      inputRefs.current[nextIdx]?.focus();
    },
    [setOtpCode]
  );

  return (
    <div className="flex flex-col items-center gap-6 w-full animate-page-fade-in">
      {/* Subheader */}
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-[15px] text-gray-label leading-relaxed">
          Enter the 6-digit verification code sent to
        </p>
        <p className="text-[15px] font-semibold text-navy break-all">{email || 'your email'}</p>
      </div>

      {/* OTP digit row */}
      <div className="flex items-center gap-3 justify-center w-full" role="group" aria-label="6-digit verification code">
        {Array.from({ length: OTP_LENGTH }).map((_, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            id={`otp-digit-${i}`}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            value={digits[i]?.trim() ?? ''}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            aria-label={`Digit ${i + 1}`}
            className={`w-12 h-14 text-center text-xl font-bold text-navy rounded-[10px] border-[2px] outline-none transition-all bg-white font-sans
              ${digits[i]?.trim()
                ? 'border-navy shadow-[0_0_0_3px_rgba(27,50,82,0.12)]'
                : error
                  ? 'border-error'
                  : 'border-gray-border focus:border-navy focus:shadow-[0_0_0_3px_rgba(27,50,82,0.10)]'
              }`}
          />
        ))}
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-error font-medium text-center" role="alert">{error}</p>
      )}

      {/* Verify button */}
      <button
        id="btn-reg-otp-verify"
        type="button"
        onClick={onVerify}
        disabled={isLoading || otpCode.length < OTP_LENGTH}
        className="w-full min-h-[52px] flex items-center justify-center gap-2.5 rounded-full border-none bg-navy text-white font-sans text-[15px] font-semibold tracking-[0.1px] cursor-pointer px-6 transition-all shadow-btn hover:bg-navy-hover hover:shadow-[0_4px_16px_rgba(27,50,82,0.28)] active:bg-navy-active active:scale-95 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed select-none"
      >
        {isLoading ? (
          <span className="inline-block w-5 h-5 border-[2.5px] border-white/40 border-t-white rounded-full animate-spin" aria-label="Verifying" />
        ) : (
          'Verify Code'
        )}
      </button>

      {/* Resend hint */}
      <p className="text-[13px] text-gray-placeholder text-center">
        Didn't receive a code?{' '}
        <button
          type="button"
          className="text-link font-medium bg-none border-none p-0 cursor-pointer hover:underline"
          onClick={() => { /* TODO: resend OTP */ }}
        >
          Resend
        </button>
      </p>
    </div>
  );
};

export default Step2OtpVerify;
