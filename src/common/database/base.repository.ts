import {
  FindOneOptions,
  FindManyOptions,
  Repository,
  DeepPartial,
} from 'typeorm';
import { DatabaseInterfaceRepository } from './database.interface';

export abstract class BaseAbstractRepository<T>
  implements DatabaseInterfaceRepository<T>
{
  constructor(private readonly repo: Repository<T>) {}

  createAndSave(data: DeepPartial<T>): Promise<T> {
    const object = this.repo.create(data);
    return this.repo.save(object);
  }

  createManyAndSave(data: DeepPartial<T>[]): Promise<T[]> {
    const object = this.repo.create(data);
    return this.repo.save(object);
  }

  findOneByCondition(filterCondition: FindOneOptions<T>): Promise<T> {
    return this.repo.findOne(filterCondition);
  }

  findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repo.find(options);
  }

  remove(data: T): Promise<T> {
    return this.repo.remove(data);
  }

  findWithRelations(relations: FindManyOptions<T>): Promise<T[]> {
    return this.repo.find(relations);
  }

  preload(entityLike: any): Promise<T> {
    return this.repo.preload(entityLike);
  }

  findOne(options: FindOneOptions<T>): Promise<T> {
    return this.repo.findOne(options);
  }
}
