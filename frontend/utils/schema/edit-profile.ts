import {z} from 'zod';
import {zodDateNotInFuture, zodEmail} from './hook-forms';

export type EditProfileValidateSchema = z.infer<
  ReturnType<typeof createEditProfileValidate>
>;

export const createEditProfileValidate = () => {
  return z.object({
    name: z.string().min(1, 'Tên không được để trống'),
    location: z.string().min(1, 'Địa chỉ không được để trống'),
    phone: z.string().min(1, 'Số điện thoại không được để trống'),
    birthDate: zodDateNotInFuture(
      'Ngày sinh không được để trống',
      'Ngày sinh không hợp lệ',
    ),
    latitude: z.number().min(1, 'Vị trí không được để trống'),
    longitude: z.number().min(1, 'Vị trí không được để trống'),
  });
};
