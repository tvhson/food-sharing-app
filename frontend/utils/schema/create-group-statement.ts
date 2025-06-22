import {z} from 'zod';

export type CreateGroupStatementSchema = z.infer<
  ReturnType<typeof createGroupStatementValidate>
>;

export const createGroupStatementValidate = () => {
  return z.object({
    user: z.string().min(1, 'Vui lòng chọn người ủng hộ'),
    description: z.string().min(1, 'Vui lòng nhập mô tả'),
  });
};
