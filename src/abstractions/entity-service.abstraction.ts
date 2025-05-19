import { BadRequestException, NotFoundException } from '@nestjs/common';

import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  ObjectId,
  ObjectLiteral,
  RemoveOptions,
  Repository,
} from 'typeorm';

export abstract class EntityService<EntityType extends ObjectLiteral> {
  protected abstract _repository: Repository<EntityType>;

  get queryBuilder() {
    return this._repository.createQueryBuilder();
  }

  get repository() {
    return this._repository;
  }

  findAll(filters?: Partial<EntityType> | FindManyOptions<EntityType>) {
    return this._repository.find(filters);
  }

  findOne(filters: Partial<EntityType> | FindOneOptions<EntityType>) {
    return this._repository.findOne(filters);
  }

  findAndCount(filters: FindManyOptions<EntityType>) {
    return this._repository.findAndCount(filters);
  }

  async save(data: DeepPartial<EntityType>): Promise<EntityType> {
    const entity = await this._repository.save(data);
    if (!entity) throw new BadRequestException('Couldn`t save entity');

    return entity;
  }

  async bulkSave(data: DeepPartial<EntityType>[]): Promise<EntityType[]> {
    const entities = await this._repository.save(data);
    if (!entities?.length) throw new BadRequestException('Couldn`t save entity');

    return entities;
  }

  async updateOne(
    filters: Partial<EntityType> | FindOneOptions<EntityType>,
    data: DeepPartial<EntityType>,
  ): Promise<EntityType> {
    const entity = await this._repository.findOne(filters);
    if (!entity) throw new NotFoundException();
    return this.save({ ...entity, ...data });
  }

  delete(
    criteria:
      | string
      | number
      | Date
      | ObjectId
      | string[]
      | number[]
      | ObjectId[]
      | FindOptionsWhere<EntityType>,
  ) {
    return this._repository.delete(criteria);
  }

  async remove(entity: EntityType, options?: RemoveOptions) {
    return this._repository.remove(entity, options);
  }
}
