import * as bcrypt from 'bcrypt';
import { userConstants } from './constants';

export const password = (pwd: string) => {
  return bcrypt.hashSync(pwd, userConstants.SALT_OR_ROUNDS);
};

export const sleep = async (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

export const generateUniqueMovieName = (movieName: string, writer: string) => {
  return `${movieName}-${writer}`
    .replace(/[.,:;!?'"`~@#$%^&*()_+=<>[\]{}|\\/]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
};
