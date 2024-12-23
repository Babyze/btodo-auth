import { ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Jwt } from './jwt';

describe('Jwt', () => {
  let configService: ConfigService;
  let jwtService: JwtService;
  let jwt: Jwt;

  beforeEach(() => {
    configService = new ConfigService();
    jwtService = new JwtService({
      secret: configService.get('JWT_SECRET_KEY'),
    });
    jwt = new Jwt(jwtService);
  });

  it('Should validate the user with valid token', async () => {
    const data = { userId: 1, name: 'Alex' };
    jest.spyOn(jwtService, 'verify').mockReturnValue(data);
    expect(await jwt.verify('valid-token')).toEqual(data);
  });

  it('should throw UnauthorizedException for invalid token', async () => {
    jest.spyOn(jwtService, 'verify').mockImplementation(() => {
      throw new ForbiddenException();
    });

    await expect(jwt.verify('invalid-token')).rejects.toThrow(
      ForbiddenException,
    );
  });
});
