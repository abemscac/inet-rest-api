import { FindConditions, Repository } from 'typeorm'

export interface IBaseService {
  existOrFail<T>(
    repository: Repository<T>,
    conditions: FindConditions<T>,
  ): Promise<void>
}
