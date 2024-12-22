import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as Joi from 'joi';
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
      }),
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
