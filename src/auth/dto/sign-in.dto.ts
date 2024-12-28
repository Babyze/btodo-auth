import { IsEmail, IsString } from 'class-validator';
import { SignInRequest } from '../pb/auth.pb';

export class SignInRequestDto implements SignInRequest {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
