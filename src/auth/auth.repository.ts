import { BaseAbstractRepository } from 'src/common/database/base.repository';
import { AuthEntity } from './entities/auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class AuthRepository extends BaseAbstractRepository<AuthEntity> {
  constructor(
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
  ) {
    super(authRepository);
  }
}
