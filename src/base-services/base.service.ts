import { NotFoundException } from '@nestjs/common'
import { FindConditions, Repository } from 'typeorm'
import { IBaseService } from './i-base.service'

export class BaseService implements IBaseService {
  async existOrFail<T>(
    repository: Repository<T>,
    conditions: FindConditions<T>,
  ): Promise<void> {
    const count = await repository.count(conditions)
    if (count === 0) {
      throw new NotFoundException()
    }
  }

  async projectTo<TResult, TEntity>(
    promise: () => Promise<TEntity | TEntity[]>,
    mapper: (value: TEntity) => TResult,
  ): Promise<TResult | TResult[]> {
    const value = await promise()
    if (Array.isArray(value)) {
      return value.map(mapper)
    } else {
      return mapper(value)
    }
  }
}
