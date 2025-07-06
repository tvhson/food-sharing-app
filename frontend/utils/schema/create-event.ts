import {z} from 'zod';
import {parseDDMMYYYY, zodDateNotInThePast} from './hook-forms';

export type CreateEventValidateSchema = z.infer<
  ReturnType<typeof createCreateEventValidate>
>;

export const createCreateEventValidate = () => {
  return z
    .object({
      title: z.string().min(1, {message: 'Tiêu đề không được để trống'}),
      description: z.string().min(1, {message: 'Mô tả không được để trống'}),
      image: z.any().refine(value => value !== null, {
        message: 'Ảnh không được để trống',
      }),
      locationName: z.string().min(1, {message: 'Vị trí không được để trống'}),
      latitude: z.number().refine(val => val !== undefined && val !== null, {
        message: 'Vị trí không được để trống',
      }),
      longitude: z.number().refine(val => val !== undefined && val !== null, {
        message: 'Vị trí không được để trống',
      }),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      startTime: z
        .string()
        .min(1, {message: 'Thời gian bắt đầu không được để trống'}),
      endTime: z
        .string()
        .min(1, {message: 'Thời gian kết thúc không được để trống'}),
      repeatDays: z.array(z.number()).optional(),
    })
    .superRefine((data, ctx) => {
      const {startDate, endDate, startTime, endTime} = data;

      if (startDate) {
        const start = parseDDMMYYYY(startDate);
        if (!start) {
          ctx.addIssue({
            path: ['startDate'],
            message: 'Ngày bắt đầu không hợp lệ',
            code: 'custom',
          });
        } else {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (start < today) {
            ctx.addIssue({
              path: ['startDate'],
              message: 'Ngày bắt đầu không được ở quá khứ',
              code: 'custom',
            });
          }
        }
      }

      // Validate endDate if present
      if (endDate) {
        const end = parseDDMMYYYY(endDate);
        if (!end) {
          ctx.addIssue({
            path: ['endDate'],
            message: 'Ngày kết thúc không hợp lệ',
            code: 'custom',
          });
        } else {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (end < today) {
            ctx.addIssue({
              path: ['endDate'],
              message: 'Ngày kết thúc không được ở quá khứ',
              code: 'custom',
            });
          }
        }
      }

      // Validate time format (HH:mm)
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (startTime && !timeRegex.test(startTime)) {
        ctx.addIssue({
          path: ['startTime'],
          message: 'Thời gian bắt đầu không đúng định dạng (HH:mm)',
          code: 'custom',
        });
      }
      if (endTime && !timeRegex.test(endTime)) {
        ctx.addIssue({
          path: ['endTime'],
          message: 'Thời gian kết thúc không đúng định dạng (HH:mm)',
          code: 'custom',
        });
      }
      // Check endTime > startTime if both present and valid
      if (
        startTime &&
        endTime &&
        timeRegex.test(startTime) &&
        timeRegex.test(endTime)
      ) {
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);
        const startTotal = startHour * 60 + startMinute;
        const endTotal = endHour * 60 + endMinute;
        if (endTotal <= startTotal) {
          ctx.addIssue({
            path: ['endTime'],
            message: 'Thời gian kết thúc phải sau thời gian bắt đầu',
            code: 'custom',
          });
        }
      }

      // Validate repeat days if provided
      if (data.repeatDays && data.repeatDays.length > 0) {
        const validDays = [0, 1, 2, 3, 4, 5, 6]; // Sunday = 0, Saturday = 6
        const invalidDays = data.repeatDays.filter(
          day => !validDays.includes(day),
        );
        if (invalidDays.length > 0) {
          ctx.addIssue({
            path: ['repeatDays'],
            message: 'Ngày lặp lại không hợp lệ',
            code: 'custom',
          });
        }
      }
    });
};
