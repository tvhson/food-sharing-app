import {phoneRegex} from './regex';

export const isValidVietnamesePhoneNumber = (string: string) => {
  return /^(?:\+84|84|0)?(2|3|5|7|8|9)[0-9]{8}$/.test(string);
};

export const validatePhoneWithCountryCode = (
  phoneNumber: string,
  countryCode = '+84',
): boolean => {
  const normalizedPhone = phoneNumber.startsWith(countryCode)
    ? phoneNumber.slice(countryCode.length)
    : phoneNumber;

  return phoneRegex.test(normalizedPhone);
};
