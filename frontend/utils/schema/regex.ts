export const phoneRegex = /^0?\d{5,}$/;

export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const nameRegex = /^[a-zA-Z0-9\s\-.\u00C0-\u1EF9]+$/;

export const messageRegex = /^[a-zA-Z0-9\s.,;:!?'"""''()\-\_&/@*+%#=$]+$/;

export const messageSanitizeInput = (value: string) => {
  const allowedCharacters = messageRegex;
  if (allowedCharacters.test(value)) {
    return value;
  }

  return value.replace(/[^a-zA-Z0-9\s.,;:!?'""''()\-\_&/@*+%#=$]+/g, '').trim();
};

export const sanitizeInput = (value: string) => {
  const forbiddenCharacters = /[<>"';\/\\`#&%(){}[\]|$^~*']/g;
  return value.replace(forbiddenCharacters, '');
};

export const validateBirthday = (value: string) => {
  const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;

  if (!datePattern.test(value)) return false;

  const [day, month, year] = value.split('/').map(Number);
  const date = new Date(year, month - 1, day);

  // Check if the date is valid
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return false;
  }

  // Check if the date is in the past
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if the person is at least 18 years old
  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
  eighteenYearsAgo.setHours(0, 0, 0, 0);

  return date <= eighteenYearsAgo;
};

export const validateDateNotInFuture = (value: string) => {
  const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;

  if (!datePattern.test(value)) return false;

  const [day, month, year] = value.split('/').map(Number);
  const date = new Date(year, month - 1, day);

  // Check if the date is valid
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return false;
  }

  // Check if the date is not in the future
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return date <= today;
};
