import {isValidVietnamesePhoneNumber} from './phone';
import {
  emailRegex,
  nameRegex,
  validateBirthday,
  validateDate,
  validateDateNotInFuture,
  validateDateNotInThePast,
} from './regex';

import {z} from 'zod';

export const zodPhoneNumber = () => {
  return z
    .string()
    .trim()
    .min(1, {message: 'Số điện thoại không được để trống'})
    .refine(
      value => {
        // For Vietnamese phone numbers, use our custom validation
        return isValidVietnamesePhoneNumber(value);
      },
      {message: 'Số điện thoại không hợp lệ'},
    );
};

export const zodFullName = () => {
  return z
    .string()
    .min(1, {message: 'Tên không được để trống'})
    .refine(value => nameRegex.test(value.trim()), {
      message: 'Tên không hợp lệ',
    })
    .refine(value => nameRegex.test(value), {
      message: 'Tên không hợp lệ',
    });
};

export const zodBirthday18 = () => {
  return z
    .string()
    .min(1, {message: 'Error:birthDateRequired'})
    .refine(value => validateBirthday(value), {
      message: 'Error:youMust18',
    });
};

export const zodEmail = (message?: string) => {
  return z
    .string()
    .min(1, {message: 'Email không được để trống'})
    .refine(value => emailRegex.test(value), {
      message: message ?? 'Email không hợp lệ',
    })
    .transform(value => value.toLowerCase());
};

export const zodEmailOrPhone = (
  message: string = 'Error:emailOrPhoneInvalid',
) => {
  return z
    .string()
    .trim()
    .min(1, {message: 'Error:usernameRequired'})
    .refine(
      value => emailRegex.test(value) || isValidVietnamesePhoneNumber(value),
      {message: message},
    )
    .transform(value => (emailRegex.test(value) ? value.toLowerCase() : value));
};

export const zodPassword = () => {
  return z
    .string()
    .trim()
    .min(1, {message: 'Mật khẩu không được để trống'})
    .min(8, {message: 'Mật khẩu phải có ít nhất 8 ký tự'})
    .max(16, {message: 'Mật khẩu phải có ít nhất 16 ký tự'})
    .regex(/^(?=.*[0-9])/, {message: 'Mật khẩu phải có ít nhất 1 số'})
    .regex(/^(?=.*[a-z])/, {
      message: 'Mật khẩu phải có ít nhất 1 chữ cái thường',
    })
    .regex(/^(?=.*[A-Z])/, {
      message: 'Mật khẩu phải có ít nhất 1 chữ cái viết hoa',
    });
};

export const zodConfirmPassword = () => {
  return z
    .string()
    .trim()
    .min(1, {message: 'Mật khẩu xác nhận không được để trống'})
    .min(8, {message: 'Mật khẩu xác nhận phải có ít nhất 8 ký tự'})
    .max(16, {message: 'Mật khẩu xác nhận phải có ít nhất 16 ký tự'})
    .regex(/^(?=.*[0-9])/, {message: 'Mật khẩu xác nhận phải có ít nhất 1 số'})
    .regex(/^(?=.*[a-z])/, {
      message: 'Mật khẩu xác nhận phải có ít nhất 1 chữ cái thường',
    })
    .regex(/^(?=.*[A-Z])/, {
      message: 'Mật khẩu xác nhận phải có ít nhất 1 chữ cái viết hoa',
    });
};

export const zodDateNotInFuture = (
  messageRequired?: string,
  messageInvalid?: string,
) => {
  return z
    .string()
    .min(1, {message: messageRequired ?? 'Ngày không được để trống'})
    .refine(value => validateDateNotInFuture(value), {
      message: messageInvalid ?? 'Ngày không hợp lệ',
    });
};

export const zodDateNotInThePast = (
  messageRequired?: string,
  messageInvalid?: string,
) => {
  return z
    .string()
    .min(1, {message: messageRequired ?? 'Ngày không được để trống'})
    .refine(value => validateDateNotInThePast(value), {
      message: messageInvalid ?? 'Ngày không hợp lệ',
    });
};

export const zodDate = (message?: string, required: boolean = true) => {
  const base = z.string();

  if (required) {
    return base
      .min(1, {message: message ?? 'Ngày không được để trống'})
      .refine(value => !!validateDate(value), {
        message: message ?? 'Ngày không hợp lệ',
      });
  } else {
    return base.optional().refine(
      value => {
        if (!value) return true;
        return !!validateDate(value);
      },
      {
        message: message ?? 'Ngày không hợp lệ',
      },
    );
  }
};

export const parseDDMMYYYY = (dateStr: string): Date | null => {
  const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = dateStr.match(datePattern);

  if (!match) return null;

  const [_, day, month, year] = match.map(Number);
  const date = new Date(year, month - 1, day);

  // Extra check: validate again after parsing
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null; // Invalid date
  }

  return date;
};
