import { IsEmail, IsStrongPassword } from 'class-validator';
import { SignUpRequest } from '../pb/auth.pb';

export class SignUpRequestDto implements SignUpRequest {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}
