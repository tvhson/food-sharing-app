import {zodEmailOrPhone} from './hook-forms';

import {z} from 'zod';

export type ForgotPasswordValidateSchema = z.infer<
  ReturnType<typeof createForgotPasswordValidate>
>;

export const createForgotPasswordValidate = () => {
  return z.object({
    username: zodEmailOrPhone(),
  });
};
