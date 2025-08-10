import { PasswordStrength } from '../types';

export const validatePassword = (password: string): PasswordStrength => {
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const hasMinLength = password.length >= 8;

  const checks = [hasUppercase, hasLowercase, hasNumber, hasSymbol, hasMinLength];
  const score = checks.filter(Boolean).length;

  return {
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSymbol,
    hasMinLength,
    score
  };
};

export const getPasswordStrengthText = (score: number): { text: string; color: string } => {
  switch (score) {
    case 0:
    case 1:
      return { text: 'Very Weak', color: 'text-red-500' };
    case 2:
      return { text: 'Weak', color: 'text-orange-500' };
    case 3:
      return { text: 'Fair', color: 'text-yellow-500' };
    case 4:
      return { text: 'Good', color: 'text-blue-500' };
    case 5:
      return { text: 'Strong', color: 'text-green-500' };
    default:
      return { text: 'Very Weak', color: 'text-red-500' };
  }
};