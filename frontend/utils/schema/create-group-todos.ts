import {z} from 'zod';
import {zodDate} from './hook-forms';

export type CreateGroupTodoSchema = z.infer<
  ReturnType<typeof createGroupTodoValidate>
>;

export const createGroupTodoValidate = () => {
  return z.object({
    title: z.string().min(1, 'Vui lòng nhập mô tả'),
    date: zodDate('Ngày bắt đầu không hợp lệ', true),
  });
};
