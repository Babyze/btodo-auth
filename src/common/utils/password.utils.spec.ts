import { PasswordUtils } from './password.utils';

describe('Password utils', () => {
  it('Should return encoded password', () => {
    const password = 'password';
    expect(PasswordUtils.encrypedPassword(password)).not.toEqual(password);
  });

  it('Should return valid password', () => {
    const password = 'password';
    const passwordEncryped = PasswordUtils.encrypedPassword(password);
    expect(PasswordUtils.isValidPassword(password, passwordEncryped)).toEqual(
      true,
    );
  });

  it('Should return invalid password', () => {
    const password = 'password';
    const fakePassword = 'fake';
    const passwordEncryped = PasswordUtils.encrypedPassword(password);
    expect(
      PasswordUtils.isValidPassword(fakePassword, passwordEncryped),
    ).toEqual(false);
  });
});
