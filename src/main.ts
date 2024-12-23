import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';
import { protobufPackage } from './auth/pb/auth.pb';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: protobufPackage,
      protoPath: join(__dirname, '..', config.get('GRPC_PROTO_PATH')),
      url: `${config.get('GRPC_HOST')}:${config.get('GRPC_PORT')}`,
    },
  });

  await app.startAllMicroservices();
}
bootstrap();
