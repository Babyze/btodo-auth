import { DeepPartial, FindManyOptions, FindOneOptions } from 'typeorm';

export interface DatabaseInterfaceRepository<T> {
  createAndSave(data: DeepPartial<T>): Promise<T>;
  createManyAndSave(data: DeepPartial<T>[]): Promise<T[]>;
  findOneByCondition(filterCondition: FindOneOptions<T>): Promise<T>;
  findAll(options?: FindManyOptions<T>): Promise<T[]>;
  remove(data: T): Promise<T>;
  findWithRelations(relations: FindManyOptions<T>): Promise<T[]>;
  preload(entityLike: DeepPartial<T>): Promise<T>;
  findOne(options: FindOneOptions<T>): Promise<T>;
}
