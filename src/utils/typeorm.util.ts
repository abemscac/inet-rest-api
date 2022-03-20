import { NotFoundException } from '@nestjs/common'
import { FindConditions, Repository } from 'typeorm'

export interface ITypeORMUtil {
  exist<T>(
    repository: Repository<T>,
    conditions: FindConditions<T>,
  ): Promise<boolean>
  existOrFail<T>(
    repository: Repository<T>,
    conditions: FindConditions<T>,
  ): Promise<void>
}

class Util implements ITypeORMUtil {
  async exist<T>(
    repository: Repository<T>,
    conditions: FindConditions<T>,
  ): Promise<boolean> {
    const count = await repository.count(conditions)
    return count > 0
  }

  async existOrFail<T>(
    repository: Repository<T>,
    conditions: FindConditions<T>,
  ): Promise<void> {
    const exist = await this.exist(repository, conditions)
    if (!exist) {
      throw new NotFoundException()
    }
  }
}

export const TypeORMUtil = new Util()
