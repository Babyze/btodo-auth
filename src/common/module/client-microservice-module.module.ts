import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  ACCOUNT_SERVICE_NAME,
  BTODO_ACCOUNT_PACKAGE_NAME,
} from 'src/auth/pb/account.pb';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: ACCOUNT_SERVICE_NAME,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: `${configService.get('ACCOUNT_GRPC_HOST')}:${configService.get('ACCOUNT_GRPC_PORT')}`,
            package: BTODO_ACCOUNT_PACKAGE_NAME,
            protoPath: configService.get('ACCOUNT_GRPC_PROTO_PATH'),
          },
        }),
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class ClientMicroserviceModule {}
