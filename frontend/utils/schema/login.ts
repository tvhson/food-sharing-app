import {z} from 'zod';
import {zodEmail, zodPassword} from './hook-forms';
export type LoginValidateSchema = z.infer<
  ReturnType<typeof createLoginValidate>
>;

export const createLoginValidate = () => {
  return z.object({
    email: zodEmail(),
    password: zodPassword(),
  });
};
