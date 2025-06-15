import {z} from 'zod';
import {parseDDMMYYYY, zodDateNotInThePast} from './hook-forms';

export type CreatePostValidateSchema = z.infer<
  ReturnType<typeof createCreatePostValidate>
>;

export const createCreatePostValidate = () => {
  return z
    .object({
      title: z.string().min(1, {message: 'Tiêu đề không được để trống'}),
      images: z.array(z.any()).min(1, {message: 'Ảnh không được để trống'}),
      description: z.string().min(1, {message: 'Mô tả không được để trống'}),
      type: z.enum(['Chay', 'Mặn'], {
        message: 'Vui lòng chọn loại thực phẩm',
      }),
      location: z.string().min(1, {message: 'Vị trí không được để trống'}),
      latitude: z.number().min(1, {message: 'Vị trí không được để trống'}),
      longitude: z.number().min(1, {message: 'Vị trí không được để trống'}),
      weight: z.string().min(1, {message: 'Trọng lượng không được để trống'}),
      portion: z.string().min(1, {message: 'Số phần không được để trống'}),
      expiredDate: zodDateNotInThePast(
        'Ngày hết hạn không được để trống',
        'Ngày hết hạn không hợp lệ',
      ),
      pickUpStartDate: zodDateNotInThePast(
        'Ngày bắt đầu nhận không được để trống',
        'Ngày bắt đầu nhận không hợp lệ',
      ),
      pickUpEndDate: zodDateNotInThePast(
        'Ngày kết thúc nhận không được để trống',
        'Ngày kết thúc nhận không hợp lệ',
      ),
    })
    .superRefine((data, ctx) => {
      const {pickUpStartDate, pickUpEndDate, expiredDate} = data;

      // If any date field is missing, skip validation
      if (!pickUpStartDate || !pickUpEndDate || !expiredDate) return;

      const start = parseDDMMYYYY(pickUpStartDate);
      const end = parseDDMMYYYY(pickUpEndDate);
      const expire = parseDDMMYYYY(expiredDate);

      if (start === null || end === null || expire === null) {
        // Let field-level zodDateNotInThePast handle these
        return;
      }

      const isStartBeforeEnd = start < end;
      const isStartBeforeExpire = start < expire;
      const isEndBeforeExpire = end < expire;

      if (!isStartBeforeEnd) {
        ctx.addIssue({
          path: ['pickUpStartDate'],
          message: 'Ngày bắt đầu nhận phải nhỏ hơn ngày kết thúc nhận',
          code: 'custom',
        });
      }

      if (!isStartBeforeExpire) {
        ctx.addIssue({
          path: ['pickUpStartDate'],
          message: 'Ngày bắt đầu nhận phải nhỏ hơn ngày hết hạn',
          code: 'custom',
        });
      }

      if (!isEndBeforeExpire) {
        ctx.addIssue({
          path: ['pickUpEndDate'],
          message: 'Ngày kết thúc nhận phải nhỏ hơn ngày hết hạn',
          code: 'custom',
        });
      }

      if (!isStartBeforeEnd || !isStartBeforeExpire || !isEndBeforeExpire) {
        ctx.addIssue({
          path: ['expiredDate'],
          message: 'Vui lòng kiểm tra lại các mốc thời gian đã chọn',
          code: 'custom',
        });
      }
    });
};
