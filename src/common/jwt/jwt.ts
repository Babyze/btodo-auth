import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class Jwt {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // Decoding JWT token
  public async decode(token: string): Promise<unknown> {
    return this.jwtService.decode(token, null);
  }

  // Generate JWT Access token
  public async generateAccessToken(data: any): Promise<string> {
    return this.jwtService.signAsync(data, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET_KEY'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRE'),
    });
  }

  // Generate JWT Refresh token
  public generateRefreshToken(data: any): Promise<string> {
    return this.jwtService.signAsync(data, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET_KEY'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRE'),
    });
  }

  // Validate JWT Token, throw forbidden error if JWT Token is invalid
  public async verify(token: string): Promise<any> {
    return this.jwtService.verify(token);
  }

  // Generate Jwt response token
  public async generateJwtResponseToken(data: any): Promise<JwtResponse> {
    return {
      accessToken: await this.generateAccessToken(data),
      refreshToken: await this.generateRefreshToken(data),
      expireDate: this.configService.get<number>('JWT_ACCESS_EXPIRE'),
    };
  }
}

export interface JwtResponse {
  accessToken: string;
  refreshToken: string;
  expireDate: number;
}
