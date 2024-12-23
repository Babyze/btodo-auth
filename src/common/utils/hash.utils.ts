import * as bcrypt from 'bcrypt';

export const Hash = {
  generateSalt: (round = 10) => {
    return bcrypt.genSaltSync(round);
  },
  generateHash: (data: string | Buffer, salt: string) => {
    return bcrypt.hashSync(data, salt);
  },
  compare: (data: string | Buffer, encrypted: string) => {
    return bcrypt.compareSync(data, encrypted);
  },
  getRounds: (encrypted: string) => {
    return bcrypt.getRounds(encrypted);
  },
};
