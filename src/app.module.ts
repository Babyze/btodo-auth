import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_ACCOUNT_USERNAME: Joi.string().required(),
        DB_ACCOUNT_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        DB_SYNCHRONIZE: Joi.boolean().required(),
        GRPC_HOST: Joi.string().required(),
        GRPC_PORT: Joi.number().required(),
        GRPC_PROTO_PATH: Joi.string().required(),
        JWT_SECRET_KEY: Joi.string().required(),
        JWT_EXPIRE: Joi.string().required(),
      }),
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
