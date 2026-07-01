// features/auth/views/LoginPage.tsx
// View: Login via Email — brand header, credential form, submit, footer links

import React from 'react';
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
  const {
    emailOrPhone,
    password,
    showPassword,
    isLoading,
    error,
    setEmailOrPhone,
    setPassword,
    togglePasswordVisibility,
    handleSubmit,
    handleForgotPassword,
    handleChurchSignUp,
    handleApprovalStatus,
  } = useLoginViewModel();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="teleo-shell">
      <div className="login-container">

        {/* ── Brand Header ── */}
        <div className="login-brand">
          <TeleoLogo size={130} />
          <h1 className="login-wordmark">TELEO</h1>
        </div>

        {/* ── Credential Form ── */}
        <div className="login-form">

          {/* Error banner */}
          {error && (
            <div className="error-banner" role="alert">
              {error}
            </div>
          )}

          {/* Email / Phone field */}
          <div className="field-group">
            <label htmlFor="input-email" className="field-label">
              Email Address or Phone Number
            </label>
            <input
              id="input-email"
              type="text"
              className="field-input"
              placeholder="Email or Phone Number"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
            />
          </div>

          {/* Password field */}
          <div className="field-group">
            <label htmlFor="input-password" className="field-label">
              Password
            </label>
            <div className="password-wrapper">
              <input
                id="input-password"
                type={showPassword ? 'text' : 'password'}
                className="field-input password-input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="current-password"
              />
              <button
                id="btn-toggle-password"
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="forgot-row">
            <button
              id="btn-forgot-password"
              type="button"
              className="link-btn"
              onClick={handleForgotPassword}
            >
              Forgot Password
            </button>
          </div>

          {/* Submit */}
          <button
            id="btn-login-submit"
            type="button"
            className={`btn-primary${isLoading ? ' btn-loading' : ''}`}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="spinner" aria-label="Loading" />
            ) : (
              'Next'
            )}
          </button>
        </div>

        {/* ── Form Footer ── */}
        <footer className="login-footer">
          <p className="footer-text">
            Register your church?{' '}
            <button
              id="btn-church-signup"
              type="button"
              className="link-btn"
              onClick={handleChurchSignUp}
            >
              Sign Up
            </button>
          </p>
          <p className="footer-text">
            <button
              id="btn-approval-status"
              type="button"
              className="link-btn"
              onClick={handleApprovalStatus}
            >
              Check Approval Status
            </button>
          </p>
        </footer>

      </div>
    </div>
  );
};

export default LoginPage;
