import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { grpcCatchErrorOrDone, PasswordUtils } from 'btodo-utils';
import { pick } from 'lodash';
import { Jwt } from 'src/common/jwt/jwt';
import { AuthRepository } from './auth.repository';
import { SignUpRequestDto } from './dto/sign-up.dto';
import { ACCOUNT_SERVICE_NAME, AccountServiceClient } from './pb/account.pb';
import { SignUpResponse } from './pb/auth.pb';

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

    const res = this.jwt.generateJwtResponseToken(
      pick(auth, ['authID', 'email']),
    );
    return res;
  }
}
