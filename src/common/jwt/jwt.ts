import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class Jwt {
  constructor(private readonly jwtService: JwtService) {}

  // Decoding JWT token
  public async decode(token: string): Promise<unknown> {
    return this.jwtService.decode(token, null);
  }

  // Generate JWT token
  public generateToken(data: any): string {
    return this.jwtService.sign(data);
  }

  // Validate JWT Token, throw forbidden error if JWT Token is invalid
  public async verify(token: string): Promise<any> {
    return this.jwtService.verify(token);
  }
}
