import { ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { JwtService } from './jwt-service.jwt';

describe('Jwt', () => {
  let configService: ConfigService;
  let nestJwtService: NestJwtService;
  let jwtService: JwtService;

  beforeEach(() => {
    configService = new ConfigService();
    nestJwtService = new NestJwtService({
      secret: configService.get('JWT_SECRET_KEY'),
    });
    jwtService = new JwtService(nestJwtService, configService);
  });

  it('Should validate the user with valid token', async () => {
    const data = { userId: 1, name: 'Alex' };
    jest.spyOn(nestJwtService, 'verify').mockReturnValue(data);
    expect(await jwtService.verifyAccessToken('valid-token')).toEqual(data);
  });

  it('should throw ForbiddenException for invalid token', async () => {
    jest.spyOn(nestJwtService, 'verify').mockImplementation(() => {
      throw new ForbiddenException();
    });

    await expect(jwtService.verifyAccessToken('invalid-token')).rejects.toThrow(
      ForbiddenException,
    );
  });
});
