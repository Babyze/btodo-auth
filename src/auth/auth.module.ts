import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from 'btodo-utils';
import { JwtService } from '@app/common/jwt/jwt-service.jwt';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { AuthEntity } from './entities/auth.entity';

@Module({
  imports: [DatabaseModule.forFeature([AuthEntity]), JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, JwtService],
})
export class AuthModule {}
