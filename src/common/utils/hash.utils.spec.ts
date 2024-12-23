import { Hash } from './hash.utils';

describe('Hash utils', () => {
  it('Should return salt string', () => {
    expect(Hash.generateSalt(12)).toBeDefined();
  });

  it('Two salt must be different', () => {
    const firstSalt = Hash.generateSalt();
    const secondSalt = Hash.generateSalt();
    expect(firstSalt).not.toEqual(secondSalt);
  });

  it('Should return encrypted hash', () => {
    const salt = Hash.generateSalt();
    const data = 'text';
    expect(Hash.generateHash(data, salt)).toBeDefined();
  });

  it('Two hash same input must be same output', () => {
    const salt = Hash.generateSalt();
    const data = 'text';
    const firstHash = Hash.generateHash(data, salt);
    const secondHash = Hash.generateHash(data, salt);
    expect(firstHash).toEqual(secondHash);
  });

  it('Should return valid hash', () => {
    const salt = Hash.generateSalt();
    const data = 'text';
    const hash = Hash.generateHash(data, salt);
    expect(Hash.compare(data, hash)).toEqual(true);
  });

  it('Should return invalid hash', () => {
    const salt = Hash.generateSalt();
    const data = 'text';
    const fakeData = 'fake';
    const hash = Hash.generateHash(data, salt);
    expect(Hash.compare(fakeData, hash)).toEqual(false);
  });

  it('Should return round', () => {
    const round = 15;
    const salt = Hash.generateSalt(round);
    const data = 'text';
    const hash = Hash.generateHash(data, salt);
    expect(Hash.getRounds(hash)).toEqual(round);
  });
});
