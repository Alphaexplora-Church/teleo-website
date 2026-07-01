// features/auth/viewModels/useLoginViewModel.ts
// ViewModel: manages all login form state and actions

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithEmail } from '../../../shared/models/authService';
import type { LoginCredentials } from '../../../shared/models/types';

interface LoginViewModel {
  emailOrPhone: string;
  password: string;
  showPassword: boolean;
  isLoading: boolean;
  error: string | null;
  setEmailOrPhone: (value: string) => void;
  setPassword: (value: string) => void;
  togglePasswordVisibility: () => void;
  handleSubmit: () => Promise<void>;
  handleForgotPassword: () => void;
  handleChurchSignUp: () => void;
  handleApprovalStatus: () => void;
}

export const useLoginViewModel = (): LoginViewModel => {
  const navigate = useNavigate();

  // Form state
  const [emailOrPhone, setEmailOrPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Async state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /** Toggle password field type between 'password' and 'text' */
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  /** Validate fields and submit credentials */
  const handleSubmit = async () => {
    if (!emailOrPhone.trim()) {
      setError('Please enter your email address or phone number.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const credentials: LoginCredentials = { emailOrPhone, password };
      const result = await loginWithEmail(credentials);

      if (result.success) {
        navigate('/dashboard', { replace: true });
      } else {
        setError(result.error ?? 'Login failed. Please try again.');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // TODO: Navigate to forgot-password flow
    navigate('/forgot-password');
  };

  const handleChurchSignUp = () => {
    navigate('/register?type=church');
  };

  const handleApprovalStatus = () => {
    navigate('/approval-status');
  };

  return {
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
  };
};
