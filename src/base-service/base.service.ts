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
}
