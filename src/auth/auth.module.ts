import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from 'btodo-utils';
import { Jwt } from 'src/common/jwt/jwt';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { AuthEntity } from './entities/auth.entity';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [DatabaseModule.forFeature([AuthEntity]), JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, JwtStrategy, Jwt],
})
export class AuthModule {}
