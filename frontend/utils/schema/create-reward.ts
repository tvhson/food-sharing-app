import {z} from 'zod';

export type CreateRewardValidateSchema = z.infer<
  ReturnType<typeof createRewardValidate>
>;

export const createRewardValidate = () => {
  return z.object({
    rewards: z.array(
      z.object({
        rewardName: z.string().min(1),
        rewardDescription: z.string().min(1),
        imageUrl: z.string().min(1),
        pointsRequired: z.number().min(1),
        stockQuantity: z.number().min(1),
      }),
    ),
  });
};
