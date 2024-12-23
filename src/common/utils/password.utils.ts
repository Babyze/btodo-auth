import { Hash } from './hash.utils';

export const PasswordUtils = {
  encrypedPassword: (password: string, round?: number) => {
    const salt = Hash.generateSalt(round);
    return Hash.generateHash(password, salt);
  },
  isValidPassword(password: string, passwordEncryped: string): boolean {
    return Hash.compare(password, passwordEncryped);
  },
};
