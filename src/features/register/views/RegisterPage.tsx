// features/register/views/RegisterPage.tsx
// View: Registration wizard shell — step-state router + progress indicator
// Consumes useRegisterViewModel exclusively; no business logic here.

import React from 'react';
import { useRegisterViewModel } from '../viewModels/useRegisterViewModel';

// ── Step sub-views ────────────────────────────────────────────
import Step1Credentials from './Step1Credentials';
import Step2OtpVerify from './Step2OtpVerify';
import Step3NameBirthday from './Step3NameBirthday';
import Step4GenderUsername from './Step4GenderUsername';
import Step5Location from './Step5Location';
import Step6ProfilePic from './Step6ProfilePic';
import Step7Summary from './Step7Summary';

// ── Progress bar ─────────────────────────────────────────────
const TOTAL_STEPS = 7;

interface StepProgressProps {
  current: number;
  total: number;
}

const StepProgress: React.FC<StepProgressProps> = ({ current, total }) => (
  <div className="w-full flex items-center gap-1.5" role="progressbar" aria-valuenow={current} aria-valuemin={1} aria-valuemax={total} aria-label={`Step ${current} of ${total}`}>
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        className={`flex-1 h-1 rounded-full transition-all duration-300 ${
          i < current ? 'bg-navy' : 'bg-gray-border'
        }`}
      />
    ))}
  </div>
);

// ── Step meta-data (titles shown in header) ───────────────────
const STEP_CONFIG: Record<number, { title: string; subtitle?: string }> = {
  1: { title: 'Create Account' },
  2: { title: 'Verify Email', subtitle: 'Enter the code we sent you' },
  3: { title: 'Your Profile', subtitle: 'Tell us about yourself' },
  4: { title: 'Your Identity', subtitle: 'Almost there!' },
  5: { title: 'Your Location', subtitle: 'Optional — helps find local content' },
  6: { title: 'Profile Photo', subtitle: 'Optional — you can skip this' },
  7: { title: 'Review', subtitle: 'Double-check your info' },
};

// ── Back chevron icon ─────────────────────────────────────────
const BackIcon: React.FC = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

// ── RegisterPage (Wizard Shell) ───────────────────────────────
const RegisterPage: React.FC = () => {
  const vm = useRegisterViewModel();
  const { currentStep, formData, errors, isLoading, otpCode, setOtpCode } = vm;
  const stepMeta = STEP_CONFIG[currentStep];

  // Decide whether to show the back button (step 7 summary: no back)
  const showBack = currentStep < 7;

  return (
    <div className="w-full max-w-[448px] min-h-dvh bg-white flex flex-col relative ring-1 ring-black/4 shadow-card">

      {/* ── Top Header Bar ── */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-border/40 px-5 pt-safe">
        <div className="flex items-center gap-3 h-[60px]">
          {/* Back button */}
          {showBack && (
            <button
              type="button"
              id="btn-reg-back"
              onClick={vm.goBack}
              aria-label="Go back"
              className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-transparent border-none cursor-pointer text-navy transition-colors hover:bg-navy/8 active:bg-navy/15"
            >
              <BackIcon />
            </button>
          )}

          {/* Title block */}
          <div className={`flex flex-col min-w-0 ${showBack ? '' : 'pl-1'}`}>
            <h1 className="text-[17px] font-bold text-navy leading-tight truncate">{stepMeta.title}</h1>
            {stepMeta.subtitle && (
              <p className="text-[12px] text-gray-placeholder leading-tight truncate">{stepMeta.subtitle}</p>
            )}
          </div>

          {/* Step counter (right-aligned) */}
          <span className="ml-auto shrink-0 text-[12px] font-semibold text-gray-placeholder tabular-nums">
            {currentStep}/{TOTAL_STEPS}
          </span>
        </div>

        {/* Progress bar */}
        <div className="pb-3">
          <StepProgress current={currentStep} total={TOTAL_STEPS} />
        </div>
      </div>

      {/* ── Step Content Area ── */}
      <div className="flex-1 flex flex-col px-6 py-7 pb-[calc(2rem+env(safe-area-inset-bottom))]">
        {currentStep === 1 && (
          <Step1Credentials
            formData={formData}
            errors={errors}
            isLoading={isLoading}
            updateField={vm.updateField}
            onSubmit={vm.handleStep1Submit}
          />
        )}

        {currentStep === 2 && (
          <Step2OtpVerify
            email={formData.email}
            otpCode={otpCode}
            setOtpCode={setOtpCode}
            error={errors.otp}
            isLoading={isLoading}
            onVerify={vm.handleOtpVerify}
          />
        )}

        {currentStep === 3 && (
          <Step3NameBirthday
            formData={formData}
            errors={errors}
            isLoading={isLoading}
            updateField={vm.updateField}
            onSubmit={vm.handleStep3Submit}
          />
        )}

        {currentStep === 4 && (
          <Step4GenderUsername
            formData={formData}
            errors={errors}
            isLoading={isLoading}
            setGender={vm.setGender}
            updateField={vm.updateField}
            onSubmit={vm.handleStep4Submit}
          />
        )}

        {currentStep === 5 && (
          <Step5Location
            currentLocation={formData.location}
            onSubmit={vm.handleStep5Submit}
            onSkip={vm.handleSkipLocation}
          />
        )}

        {currentStep === 6 && (
          <Step6ProfilePic
            profilePictureUrl={formData.profilePictureUrl}
            onFileSelected={vm.handleStep6Submit}
            onSkip={vm.handleSkipProfilePic}
          />
        )}

        {currentStep === 7 && (
          <Step7Summary
            formData={formData}
            errors={{ general: errors.general }}
            isLoading={isLoading}
            onSubmit={vm.handleFinalSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
