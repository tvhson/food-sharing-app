import {z} from 'zod';
import {
  zodConfirmPassword,
  zodEmail,
  zodFullName,
  zodPassword,
} from './hook-forms';
export type RegisterValidateSchema = z.infer<
  ReturnType<typeof createRegisterValidate>
>;

export const createRegisterValidate = () => {
  return z
    .object({
      name: zodFullName(),
      email: zodEmail(),
      password: zodPassword(),
      confirmPassword: zodConfirmPassword(),
    })
    .refine(data => data.password === data.confirmPassword, {
      message: 'Mật khẩu không khớp',
      path: ['confirmPassword'],
    });
};
