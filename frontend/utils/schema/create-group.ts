import {z} from 'zod';
import {formatDate} from '../helper';
import {zodDate} from './hook-forms';

export type GroupValidateSchema = z.infer<
  ReturnType<typeof createGroupValidate>
>;

export const createGroupValidate = () => {
  return z
    .object({
      name: z.string().min(1, 'Tên không được để trống'),
      description: z.string().min(1, 'Mô tả không được để trống'),
      startDate: zodDate('Ngày bắt đầu không hợp lệ', true),
      endDate: zodDate('Ngày kết thúc không hợp lệ', false),
      image: z.any().refine(value => value !== null, {
        message: 'Ảnh không được để trống',
      }),
      joinType: z.enum(['PUBLIC', 'PRIVATE'], {
        message: 'Vui lòng chọn loại nhóm',
      }),
      locationName: z.string().min(1, 'Vị trí không được để trống'),
      latitude: z.number().refine(val => val !== undefined && val !== null, {
        message: 'Vị trí không được để trống',
      }),
      longitude: z.number().refine(val => val !== undefined && val !== null, {
        message: 'Vị trí không được để trống',
      }),
    })
    .superRefine((data, ctx) => {
      const startDate = data.startDate
        ? new Date(formatDate(data.startDate))
        : undefined;
      const endDate = data.endDate
        ? new Date(formatDate(data.endDate))
        : undefined;
      if (startDate && endDate && startDate > endDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Ngày bắt đầu phải trước ngày kết thúc',
          path: ['endDate', 'startDate'],
        });
      }
    });
};
