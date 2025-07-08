import {zodEmail, zodEmailOrPhone, zodPassword} from './hook-forms';

import {z} from 'zod';

export type ForgotPasswordValidateSchema = z.infer<
  ReturnType<typeof createForgotPasswordValidate>
>;

export const createForgotPasswordValidate = () => {
  return z.object({
    username: zodEmail(),
  });
};

export type ResetPasswordValidateSchema = z.infer<
  ReturnType<typeof createResetPasswordValidate>
>;

export const createResetPasswordValidate = () => {
  return z
    .object({
      newPassword: zodPassword(),
      confirmPassword: zodPassword(),
    })
    .refine(data => data.newPassword === data.confirmPassword, {
      message: 'Mật khẩu không khớp',
      path: ['confirmPassword'],
    });
};
