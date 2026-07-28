// features/auth/views/LoginPage.tsx
// View: Login via Email — brand header, credential form, submit, footer links

import React from 'react';
import { useNavigate } from 'react-router-dom';
import TeleoLogo from '../../../shared/components/TeleoLogo';
import { useLoginViewModel } from '../viewModels/useLoginViewModel';

// ── Eye icons for password toggle ──────────────────────────
const EyeOpenIcon: React.FC = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeClosedIcon: React.FC = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

// ── Login Page ──────────────────────────────────────────────
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    email,
    password,
    showPassword,
    isLoading,
    error,
    setEmail,
    setPassword,
    togglePasswordVisibility,
    handleSubmit,
    handleForgotPassword,
  } = useLoginViewModel();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="w-full min-h-dvh flex flex-col lg:flex-row bg-[#001739]">

      {/* ── Left Hero Panel (desktop only) ── */}
      <div className="hidden lg:flex lg:flex-1 flex-col items-center justify-center px-16 relative overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 60% at 40% 50%, rgba(255,255,255,0.07) 0%, transparent 70%)' }} />
        <div className="relative z-10 flex flex-col items-center gap-6 text-center">
          <TeleoLogo size={160} />
          <h1 className="text-5xl font-black tracking-[10px] text-white leading-none font-sans">TELEO</h1>
          <p className="text-white/60 text-lg max-w-[320px] leading-relaxed font-light">
            Your all-in-one church community app. Stay connected, grow in faith.
          </p>
        </div>
        {/* Decorative circles */}
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full border border-white/5" />
        <div className="absolute -bottom-16 -left-16 w-[350px] h-[350px] rounded-full border border-white/5" />
      </div>

      {/* ── Right Card / Mobile Full Screen ── */}
      <div className="flex-1 lg:flex-none lg:w-[480px] flex items-center justify-center bg-white lg:rounded-l-[40px] min-h-dvh lg:min-h-0 lg:my-6 lg:mr-6 lg:shadow-[0_20px_60px_rgba(0,0,0,0.3)] relative">
        {/* Back button */}
        <button
          className="absolute top-6 left-4 bg-transparent border-none cursor-pointer text-navy flex items-center justify-center p-2 rounded-full transition-colors hover:bg-navy/5 z-10"
          onClick={() => navigate('/welcome')}
          aria-label="Go back"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>

        <div className="w-full max-w-[448px] lg:max-w-none flex flex-col items-center pt-12 px-7 pb-[calc(2.25rem+env(safe-area-inset-bottom))] lg:px-10 lg:py-12 gap-0 animate-page-fade-in">

          {/* ── Brand Header (mobile only) ── */}
          <div className="lg:hidden flex flex-col items-center gap-3 mb-11">
            <TeleoLogo size={130} />
            <h1 className="text-4xl font-black tracking-[6px] text-navy text-center leading-none font-sans">TELEO</h1>
          </div>

          {/* ── Desktop Header ── */}
          <div className="hidden lg:flex flex-col items-start gap-2 mb-10 w-full">
            <h2 className="text-3xl font-black text-navy tracking-[-0.5px] leading-tight">Sign in 👋</h2>
            <p className="text-gray-label text-base">Enter your email and password to continue.</p>
          </div>

          {/* ── Credential Form ── */}
          <div className="w-full flex flex-col gap-4 flex-1">

            {/* Error banner */}
            {error && (
              <div className="w-full py-3 px-3.5 rounded-lg bg-error-bg text-error text-sm font-medium border border-red-600/20" role="alert">
                {error}
              </div>
            )}

            {/* Email field */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="input-email" className="text-sm font-medium text-gray-label tracking-[0.05px]">
                Email Address
              </label>
              <input
                id="input-email"
                type="text"
                className="w-full min-h-[52px] px-3.5 rounded-[10px] border-[1.5px] border-gray-border bg-white font-sans text-[15px] text-gray-label outline-none transition-all focus:border-navy focus:shadow-[0_0_0_3px_rgba(27,50,82,0.10)]"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
              />
            </div>

            {/* Password field */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="input-password" className="text-sm font-medium text-gray-label tracking-[0.05px]">
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  id="input-password"
                  type={showPassword ? 'text' : 'password'}
                  className="w-full min-h-[52px] pl-3.5 pr-12 rounded-[10px] border-[1.5px] border-gray-border bg-white font-sans text-[15px] text-gray-label outline-none transition-all focus:border-navy focus:shadow-[0_0_0_3px_rgba(27,50,82,0.10)]"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoComplete="current-password"
                />
                <button
                  id="btn-toggle-password"
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-none border-none p-1 cursor-pointer text-gray-placeholder flex items-center justify-center rounded-md transition-colors hover:text-navy"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-start -mt-1">
              <button
                id="btn-forgot-password"
                type="button"
                className="bg-none border-none p-0 cursor-pointer font-sans text-[13px] font-medium text-link transition-opacity hover:underline hover:opacity-85 active:opacity-65"
                onClick={handleForgotPassword}
              >
                Forgot Password
              </button>
            </div>

            {/* Submit */}
            <button
              id="btn-login-submit"
              type="button"
              className={`w-full min-h-[52px] flex items-center justify-center gap-2.5 rounded-full border-none bg-navy text-white font-sans text-[15px] font-semibold tracking-[0.1px] cursor-pointer px-6 transition-all shadow-btn hover:bg-navy-hover hover:shadow-[0_4px_16px_rgba(27,50,82,0.28)] active:bg-navy-active active:scale-95 active:shadow-none disabled:opacity-65 disabled:cursor-not-allowed select-none${isLoading ? ' pointer-events-none' : ''}`}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="inline-block w-5 h-5 border-[2.5px] border-white/40 border-t-white rounded-full animate-spin" aria-label="Loading" />
              ) : (
                'Next'
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
