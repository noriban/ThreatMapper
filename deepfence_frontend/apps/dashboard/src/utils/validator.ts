import { z } from 'zod';

// not white space on input
const regex = /^\S*$/;

export const validateWhiteSpace = (value: string) => {
  const schema = z.string().min(1).trim().regex(regex);
  try {
    schema.parse(value);
    return false;
  } catch (error) {
    return true;
  }
};
