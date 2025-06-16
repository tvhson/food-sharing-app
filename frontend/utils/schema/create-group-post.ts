import {z} from 'zod';
import {formatDate} from '../helper';
import {zodDate} from './hook-forms';

export type CreteGroupPostSchema = z.infer<
  ReturnType<typeof createGroupPostValidate>
>;

export const createGroupPostValidate = () => {
  return z.object({
    description: z.string(),
  });
};
