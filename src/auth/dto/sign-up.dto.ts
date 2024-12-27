import { IsEmail, IsString } from 'class-validator';
import { SignUpRequest } from '../pb/auth.pb';

export class SignUpRequestDto implements SignUpRequest {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
