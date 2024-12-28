import {
  Controller,
  UseFilters,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { SignUpRequestDto } from './dto/sign-up.dto';
import {
  AUTH_SERVICE_NAME,
  RefreshTokenResponse,
  SignInResponse,
  SignUpResponse,
  VerifyResponse,
} from './pb/auth.pb';
import { GrpcDataTransformInterceptor } from '@app/common/interceptors/grpc-data-transform-interceptor.interceptor';
import { GrpcDataTransformPipe } from '@app/common/pipes/grpc-data-transform-pipe.pipe';
import { AllExceptionFilter } from '@app/common/filters/rpc-to-http-exception.filter';
import { SignInRequestDto } from './dto/sign-in.dto';
import { VerifyRequestDto } from './dto/verify.dto';
import { RefreshTokenRequestDto } from './dto/refresh-token.dto';

@Controller()
@UsePipes(GrpcDataTransformPipe, ValidationPipe)
@UseInterceptors(GrpcDataTransformInterceptor)
@UseFilters(AllExceptionFilter)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod(AUTH_SERVICE_NAME, 'SignUp')
  SignUp(payload: SignUpRequestDto): Promise<SignUpResponse> {
    return this.authService.signUp(payload);
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'SignIn')
  SignIn(payload: SignInRequestDto): Promise<SignInResponse> {
    return this.authService.signIn(payload);
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'Verify')
  Verify(payload: VerifyRequestDto): Promise<VerifyResponse> {
    return this.authService.verifyJwt(payload);
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'RefreshToken')
  RefreshToken(payload: RefreshTokenRequestDto): Promise<RefreshTokenResponse> {
    return this.authService.refreshToken(payload);
  }
}
