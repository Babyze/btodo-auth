import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'btodo-utils';
import * as Joi from 'joi';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './auth/auth.module';
import { ClientMicroserviceModule } from './common/module/client-microservice-module.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
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
        ACCOUNT_GRPC_HOST: Joi.string().required(),
        ACCOUNT_GRPC_PORT: Joi.number().required(),
        ACCOUNT_GRPC_PROTO_PATH: Joi.string().required(),
        JWT_ACCESS_SECRET_KEY: Joi.string().required(),
        JWT_REFRESH_SECRET_KEY: Joi.string().required(),
        JWT_ACCESS_EXPIRE: Joi.number().required(),
        JWT_REFRESH_EXPIRE: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow('DB_HOST'),
        port: configService.getOrThrow('DB_PORT'),
        username: configService.getOrThrow('DB_ACCOUNT_USERNAME'),
        password: configService.getOrThrow('DB_ACCOUNT_PASSWORD'),
        database: configService.getOrThrow('DB_NAME'),
        synchronize: configService.getOrThrow('DB_SYNCHRONIZE'),
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    DatabaseModule,
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        },
      },
    }),
    AuthModule,
    ClientMicroserviceModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
