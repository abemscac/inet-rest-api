import { NotFoundException } from '@nestjs/common'
import { FindConditions, Repository } from 'typeorm'

export interface ITypeORMUtil {
  existOrFail<T>(
    repository: Repository<T>,
    conditions: FindConditions<T>,
  ): Promise<void>
}

export const TypeORMUtil: ITypeORMUtil = {
  async existOrFail<T>(
    repository: Repository<T>,
    conditions: FindConditions<T>,
  ): Promise<void> {
    const count = await repository.count(conditions)
    if (count === 0) {
      throw new NotFoundException()
    }
  },
}
