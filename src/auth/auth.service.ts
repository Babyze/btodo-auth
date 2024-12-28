import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  grpcCatchErrorOrDone,
  NotFoundError,
  PasswordUtils,
  UnauthenticatedError,
} from 'btodo-utils';
import { pick } from 'lodash';
import { Jwt } from 'src/common/jwt/jwt';
import { AuthRepository } from './auth.repository';
import { SignUpRequestDto } from './dto/sign-up.dto';
import { ACCOUNT_SERVICE_NAME, AccountServiceClient } from './pb/account.pb';
import { SignInResponse, SignUpResponse } from './pb/auth.pb';
import { SignInRequestDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  private accountServiceClient: AccountServiceClient;

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwt: Jwt,
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

    return this.jwt.generateJwtResponseToken(pick(auth, ['authID', 'email']));
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

    return this.jwt.generateJwtResponseToken(pick(auth, ['authID', 'email']));
  }
}
