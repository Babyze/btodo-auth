import { IsString } from 'class-validator';
import { AuthEntity } from '../entities/auth.entity';
import { VerifyRequest } from '../pb/auth.pb';

export class VerifyRequestDto implements VerifyRequest {
  @IsString()
  accessToken: string;
}

export type JwtInformation = Pick<AuthEntity, 'authID' | 'email'>;
