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
import { AUTH_SERVICE_NAME, SignUpResponse } from './pb/auth.pb';
import { GrpcDataTransformInterceptor } from '@app/common/interceptors/grpc-data-transform-interceptor.interceptor';
import { GrpcDataTransformPipe } from '@app/common/pipes/grpc-data-transform-pipe.pipe';
import { AllExceptionFilter } from '@app/common/filters/rpc-to-http-exception.filter';

@Controller()
@UsePipes(GrpcDataTransformPipe, ValidationPipe)
@UseInterceptors(GrpcDataTransformInterceptor)
@UseFilters(AllExceptionFilter)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod(AUTH_SERVICE_NAME, 'SignUp')
  private async CreateAccount(
    payload: SignUpRequestDto,
  ): Promise<SignUpResponse> {
    return this.authService.signUp(payload);
  }
}
