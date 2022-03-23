import { NotFoundException } from '@nestjs/common'
import { Connection, EntityManager, FindConditions, Repository } from 'typeorm'

export interface ITypeORMUtil {
  exist<T>(
    repository: Repository<T>,
    conditions: FindConditions<T>,
  ): Promise<boolean>
  existOrFail<T>(
    repository: Repository<T>,
    conditions: FindConditions<T>,
  ): Promise<void>
  transaction<T>(
    connection: Connection,
    callback: ITypeORMUtilTransactionCallback<T>,
  ): Promise<T>
}

type ITypeORMUtilTransactionCallback<T> = (
  manager: EntityManager,
  commit: () => Promise<void>,
  rollback: () => Promise<void>,
) => Promise<T>

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

  async transaction<T>(
    connection: Connection,
    callback: ITypeORMUtilTransactionCallback<T>,
  ): Promise<T> {
    const queryRunner = connection.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try {
      return callback(
        queryRunner.manager,
        queryRunner.commitTransaction,
        queryRunner.rollbackTransaction,
      )
    } catch (error) {
      throw error
    } finally {
      await queryRunner.release()
    }
  }
}

export const TypeORMUtil = new Util()
