import {useMutation} from '@tanstack/react-query';
import {forgotPassword, verifyOtp, resetPassword} from './AccountsApi';

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => forgotPassword(email),
    onError: error => {
      console.error('Forgot password error:', error);
    },
  });
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: ({email, otp}: {email: string; otp: string}) =>
      verifyOtp(email, otp),
    onError: error => {
      console.error('OTP verification error:', error);
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({email, newPassword}: {email: string; newPassword: string}) =>
      resetPassword(email, newPassword),
    onError: error => {
      console.error('Password reset error:', error);
    },
  });
};
