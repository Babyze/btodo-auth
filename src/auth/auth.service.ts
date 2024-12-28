import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  grpcCatchErrorOrDone,
  NotFoundError,
  PasswordUtils,
  UnauthenticatedError,
} from 'btodo-utils';
import { pick } from 'lodash';
import { JwtService } from '@app/common/jwt/jwt-service.jwt';
import { AuthRepository } from './auth.repository';
import { SignInRequestDto } from './dto/sign-in.dto';
import { SignUpRequestDto } from './dto/sign-up.dto';
import { JwtInformation, VerifyRequestDto } from './dto/verify.dto';
import { ACCOUNT_SERVICE_NAME, AccountServiceClient } from './pb/account.pb';
import {
  RefreshTokenResponse,
  SignInResponse,
  SignUpResponse,
  VerifyResponse,
} from './pb/auth.pb';
import { RefreshTokenRequestDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  private accountServiceClient: AccountServiceClient;

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    @Inject(ACCOUNT_SERVICE_NAME)
    private readonly client: ClientGrpc,
  ) {
    this.accountServiceClient =
      this.client.getService<AccountServiceClient>(ACCOUNT_SERVICE_NAME);
  }

  async signUp(payload: SignUpRequestDto): Promise<SignUpResponse> {
    const account = await grpcCatchErrorOrDone(
      this.accountServiceClient.createAccount(payload),
    );

    const auth = await this.authRepository.createAndSave({
      accountID: account.accountID,
      email: payload.email,
      password: PasswordUtils.encrypedPassword(payload.password),
    });

    return this.jwtService.generateJwtResponseToken(
      pick(auth, ['authID', 'email']),
    );
  }

  async signIn(payload: SignInRequestDto): Promise<SignInResponse> {
    const auth = await this.authRepository.findOne({
      where: {
        email: payload.email,
      },
    });
    if (!auth) {
      throw new NotFoundError(`Invalid email or password`);
    }

    const isPasswordInvalid = !PasswordUtils.isValidPassword(
      payload.password,
      auth.password,
    );
    if (isPasswordInvalid) {
      throw new UnauthenticatedError('Invalid email or password');
    }

    return this.jwtService.generateJwtResponseToken(
      pick(auth, ['authID', 'email']),
    );
  }

  async verifyJwt(payload: VerifyRequestDto): Promise<VerifyResponse> {
    const jwtInfo = (await this.jwtService.verifyAccessToken(
      payload.accessToken,
    )) as JwtInformation;

    const auth = await this.authRepository.findOne({
      where: {
        authID: jwtInfo.authID,
      },
    });

    if (!auth) {
      throw new UnauthenticatedError('Unauthenticated');
    }

    return {
      isValid: !!auth,
    };
  }

  async refreshToken(
    payload: RefreshTokenRequestDto,
  ): Promise<RefreshTokenResponse> {
    const jwtInfo = (await this.jwtService.verifyRefreshToken(
      payload.refreshToken,
    )) as JwtInformation;

    const auth = await this.authRepository.findOne({
      where: {
        authID: jwtInfo.authID,
      },
    });

    if (!auth) {
      throw new UnauthenticatedError('Unauthenticated');
    }

    return this.jwtService.generateJwtResponseToken(
      pick(jwtInfo, 'authID', 'email'),
    );
  }
}
