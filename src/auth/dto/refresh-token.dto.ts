import { IsJWT } from 'class-validator';
import { RefreshTokenRequest } from '../pb/auth.pb';

export class RefreshTokenRequestDto implements RefreshTokenRequest {
  @IsJWT()
  refreshToken: string;
}
