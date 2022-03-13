import { FindConditions, Repository } from 'typeorm'

export interface IBaseService {
  existOrFail<T>(
    repository: Repository<T>,
    conditions: FindConditions<T>,
  ): Promise<void>
  projectTo<TResult, TEntity>(
    promise: () => Promise<TEntity | Array<TEntity>>,
    mapper: (value: TEntity) => TResult,
  ): Promise<TResult | Array<TResult>>
}
