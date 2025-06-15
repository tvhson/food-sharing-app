import {z} from 'zod';
import {zodPhoneNumber} from './hook-forms';

export type ExchangeRewardValidateSchema = z.infer<
  ReturnType<typeof createExchangeRewardValidate>
>;

export const createExchangeRewardValidate = () => {
  return z.object({
    phone: zodPhoneNumber(),
    address: z.string().min(1, 'Địa chỉ không được để trống'),
  });
};
