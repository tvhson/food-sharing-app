import {z} from 'zod';

export type CreateRewardValidateSchema = z.infer<
  ReturnType<typeof createRewardValidate>
>;

export type EditRewardValidateSchema = z.infer<
  ReturnType<typeof editRewardValidate>
>;

export const createRewardValidate = () => {
  return z.object({
    rewards: z.array(
      z.object({
        rewardName: z.string().min(1, 'Tên quà không được để trống'),
        imageUrl: z.string().min(1, 'Ảnh quà không được để trống'),
        pointsRequired: z
          .string()
          .min(1, 'Số lượng Star Point không được để trống')
          .refine(val => Number(val) > 0, {
            message: 'Số lượng Star Point phải lớn hơn 0',
          }),
        stockQuantity: z
          .string()
          .min(1, 'Số lượng quà không được để trống')
          .refine(val => Number(val) > 0, {
            message: 'Số lượng quà phải lớn hơn 0',
          }),
      }),
    ),
  });
};

export const editRewardValidate = () => {
  return z.object({
    rewardName: z.string().min(1, 'Tên quà không được để trống'),
    imageUrl: z.string().min(1, 'Ảnh quà không được để trống'),
    pointsRequired: z
      .string()
      .min(1, 'Số lượng Star Point không được để trống')
      .refine(val => Number(val) > 0, {
        message: 'Số lượng Star Point phải lớn hơn 0',
      }),
    stockQuantity: z
      .string()
      .min(1, 'Số lượng quà không được để trống')
      .refine(val => Number(val) > 0, {
        message: 'Số lượng quà phải lớn hơn 0',
      }),
  });
};
