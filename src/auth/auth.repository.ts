import { AuthEntity } from './entities/auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseAbstractRepository } from 'btodo-utils';
import { Repository } from 'typeorm';

export class AuthRepository extends BaseAbstractRepository<AuthEntity> {
  constructor(
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
  ) {
    super(authRepository);
  }
}
