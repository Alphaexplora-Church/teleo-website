// features/register/viewModels/useRegisterViewModel.ts
// ViewModel: drives ALL business state for the 7-step registration wizard.
// Views NEVER import API or types directly — they consume this hook only.

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendOtpEmail, verifyOtp, submitRegistration } from '../models/registerApi';
import type {
  RegistrationStep,
  RegistrationFormData,
  RegistrationErrors,
  GenderOption,
  LocationData,
} from '../models/registerTypes';

// ── Initial state ─────────────────────────────────────────────
const INITIAL_FORM: RegistrationFormData = {
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  birthMonth: '',
  birthDay: '',
  birthYear: '',
  gender: null,
  username: '',
  location: null,
  profilePictureFile: null,
  profilePictureUrl: null,
};

// ── Email regex ───────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ── ViewModel interface ───────────────────────────────────────
export interface RegisterViewModelReturn {
  currentStep: RegistrationStep;
  formData: RegistrationFormData;
  errors: RegistrationErrors;
  isLoading: boolean;
  otpCode: string;
  setOtpCode: (code: string) => void;
  updateField: <K extends keyof RegistrationFormData>(key: K, value: RegistrationFormData[K]) => void;
  setGender: (gender: GenderOption) => void;
  // Step handlers
  handleStep1Submit: () => Promise<void>;
  handleOtpVerify: () => Promise<void>;
  handleStep3Submit: () => void;
  handleStep4Submit: () => void;
  handleStep5Submit: (location: LocationData) => void;
  handleSkipLocation: () => void;
  handleStep6Submit: (file: File) => void;
  handleSkipProfilePic: () => void;
  handleFinalSubmit: () => Promise<void>;
  goBack: () => void;
}

export const useRegisterViewModel = (): RegisterViewModelReturn => {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<RegistrationStep>(1);
  const [formData, setFormData] = useState<RegistrationFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<RegistrationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  // ── Generic field updater ─────────────────────────────────
  const updateField = useCallback(
    <K extends keyof RegistrationFormData>(key: K, value: RegistrationFormData[K]) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
      // Clear the error for the field being edited
      if (errors[key as keyof RegistrationErrors]) {
        setErrors((prev) => ({ ...prev, [key]: undefined }));
      }
    },
    [errors]
  );

  const setGender = useCallback((gender: GenderOption) => {
    setFormData((prev) => ({ ...prev, gender }));
    setErrors((prev) => ({ ...prev, gender: undefined }));
  }, []);

  // ── Back navigation ───────────────────────────────────────
  const goBack = useCallback(() => {
    if (currentStep === 1) {
      navigate(-1);
    } else if (currentStep === 3) {
      setCurrentStep(1);
    } else {
      setCurrentStep((prev) => (prev - 1) as RegistrationStep);
    }
  }, [currentStep, navigate]);

  // ── Step 1: Credentials ───────────────────────────────────
  const handleStep1Submit = useCallback(async () => {
    const newErrors: RegistrationErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!EMAIL_RE.test(formData.email.trim())) {
      newErrors.email = 'Enter a valid email address.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setCurrentStep(3);
  }, [formData.email, formData.password, formData.confirmPassword]);

  // ── Step 2: OTP Verification ──────────────────────────────
  const handleOtpVerify = useCallback(async () => {
    if (otpCode.length < 6) {
      setErrors({ otp: 'Please enter the complete 6-digit code.' });
      return;
    }

    setErrors({});
    setIsLoading(true);
    try {
      const result = await verifyOtp(otpCode);
      if (result.success) {
        setCurrentStep(3);
      } else {
        setErrors({ otp: result.error ?? 'Invalid code. Please try again.' });
      }
    } catch {
      setErrors({ otp: 'Verification failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  }, [otpCode]);

  // ── Step 3: Name & Birthday ───────────────────────────────
  const handleStep3Submit = useCallback(() => {
    const newErrors: RegistrationErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required.';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required.';
    if (!formData.birthMonth) newErrors.birthMonth = 'Select a month.';
    if (!formData.birthDay) newErrors.birthDay = 'Select a day.';
    if (!formData.birthYear) newErrors.birthYear = 'Select a year.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setCurrentStep(4);
  }, [formData.firstName, formData.lastName, formData.birthMonth, formData.birthDay, formData.birthYear]);

  // ── Step 4: Gender & Username ─────────────────────────────
  const handleStep4Submit = useCallback(() => {
    const newErrors: RegistrationErrors = {};

    if (!formData.gender) newErrors.gender = 'Please select a gender identity.';
    if (!formData.username.trim()) newErrors.username = 'Username is required.';
    else if (formData.username.trim().length < 3) newErrors.username = 'Username must be at least 3 characters.';
    else if (!/^[a-zA-Z0-9_]+$/.test(formData.username.trim())) {
      newErrors.username = 'Only letters, numbers, and underscores allowed.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setCurrentStep(5);
  }, [formData.gender, formData.username]);

  // ── Step 5: Location ──────────────────────────────────────
  const handleStep5Submit = useCallback((location: LocationData) => {
    setFormData((prev) => ({ ...prev, location }));
    setErrors({});
    setCurrentStep(6);
  }, []);

  const handleSkipLocation = useCallback(() => {
    setFormData((prev) => ({ ...prev, location: null }));
    setCurrentStep(6);
  }, []);

  // ── Step 6: Profile Picture ───────────────────────────────
  const handleStep6Submit = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, profilePictureFile: file, profilePictureUrl: url }));
    setCurrentStep(7);
  }, []);

  const handleSkipProfilePic = useCallback(() => {
    setCurrentStep(7);
  }, []);

  // ── Step 7: Final Submit ──────────────────────────────────
  const handleFinalSubmit = useCallback(async () => {
    setErrors({});
    setIsLoading(true);
    try {
      const result = await submitRegistration(formData);
      if (result.success) {
        navigate('/dashboard', { replace: true });
      } else {
        setErrors({ general: result.error ?? 'Registration failed. Please try again.' });
      }
    } catch {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  }, [formData, navigate]);

  return {
    currentStep,
    formData,
    errors,
    isLoading,
    otpCode,
    setOtpCode,
    updateField,
    setGender,
    handleStep1Submit,
    handleOtpVerify,
    handleStep3Submit,
    handleStep4Submit,
    handleStep5Submit,
    handleSkipLocation,
    handleStep6Submit,
    handleSkipProfilePic,
    handleFinalSubmit,
    goBack,
  };
};
