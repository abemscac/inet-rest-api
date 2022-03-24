import { BadRequestException, NotFoundException } from '@nestjs/common'
import { PagableParams, Pagination } from 'src/shared-params/pagable.params'
import { ICursorPaginationViewModel } from 'src/shared-view-models/i-cursor-pagination.view-model'
import { IPagableViewModel } from 'src/shared-view-models/i-pagable.view-model'
import { IPaginationViewModel } from 'src/shared-view-models/i-pagination.view-model'
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm'

export type IBaseProjectorMapper<TProjection, TResult> = (
  projection: TProjection,
  index: number,
  source: Array<TProjection>,
) => TResult

export type IBaseProjectorQueryCallback<TEntity> = (
  queryBuilder: SelectQueryBuilder<TEntity>,
) => void

export interface IBaseProjector<T> {
  get sql(): string
  where(where: string, parameters: ObjectLiteral): this
  andWhere(where: string, parameters: ObjectLiteral): this
  orderBy(sort: string, order?: 'ASC' | 'DESC'): this
  project(): Promise<T>
  projectOrFail(): Promise<T>
  projectMany(): Promise<Array<T>>
  /**
   * You shou validate the params by {@link src/shared-params/pagable.params.ts} first.
   */
  projectPagination(params: PagableParams): Promise<IPagableViewModel<T>>
}

export class BaseProjector<TEntity, TResult, TProjection = TEntity> {
  private mapper?: IBaseProjectorMapper<TProjection, TResult>

  constructor(
    private readonly queryBuilder: SelectQueryBuilder<TEntity>,
    private readonly alias: string,
  ) {}

  get sql(): string {
    return this.queryBuilder.getSql()
  }

  where(where: string, parameters: ObjectLiteral): this {
    this.queryBuilder.where(where, parameters)
    return this
  }

  andWhere(where: string, parameters: ObjectLiteral): this {
    this.queryBuilder.andWhere(where, parameters)
    return this
  }

  orderBy(sort: string, order?: 'ASC' | 'DESC'): this {
    this.queryBuilder.orderBy(sort, order)
    return this
  }

  protected setMapper(
    mapper: IBaseProjectorMapper<TProjection, TResult>,
  ): this {
    this.mapper = mapper
    return this
  }

  async project(): Promise<TResult> {
    const projection = await this.queryBuilder.getRawOne()
    return !this.mapper ? projection : this.mapper(projection, 0, [projection])
  }

  async projectOrFail(): Promise<TResult> {
    const projection = await this.queryBuilder.getRawOne()
    if (!projection) {
      throw new NotFoundException()
    }
    return !this.mapper ? projection : this.mapper(projection, 0, [projection])
  }

  async projectMany(): Promise<Array<TResult>> {
    const projections = await this.queryBuilder.getRawMany()
    return !this.mapper ? projections : projections.map(this.mapper)
  }

  async projectPagination(
    params: PagableParams,
  ): Promise<IPagableViewModel<TResult>> {
    const { pagination } = params
    if (!pagination) {
      this.setOffsetAndLimit(params)
      return await this.projectMany()
    } else if (pagination === Pagination.default) {
      return await this.projectDefaultPagination(params)
    } else if (pagination === Pagination.cursor) {
      return await this.projectCursorPagination(params)
    } else {
      throw new BadRequestException(`Unknown pagination '${pagination}'.`)
    }
  }

  private async projectDefaultPagination(
    params: PagableParams,
  ): Promise<IPaginationViewModel<TResult>> {
    const { page, limit, FLAG_UNLIMITED } = params

    const totalCount = await this.queryBuilder.getCount()
    const totalPages = FLAG_UNLIMITED
      ? Number(totalCount > 0)
      : Math.ceil(totalCount / limit)

    this.setOffsetAndLimit(params)
    const data = await this.getMappedArray()

    return {
      page: FLAG_UNLIMITED ? 0 : page,
      limit: FLAG_UNLIMITED ? undefined : limit,
      totalCount,
      totalPages,
      data,
    }
  }

  private async projectCursorPagination(
    params: PagableParams,
  ): Promise<ICursorPaginationViewModel<TResult>> {
    if (!this.alias) {
      throw new BadRequestException(
        `Param 'alias' must be provided when using cursor pagination in projector.`,
      )
    }
    const { limit, cursor } = params
    this.queryBuilder.where(`${this.alias}.id > :cursor`, { cursor })

    this.setOffsetAndLimit(params)
    const data = await this.getMappedArray()

    return {
      cursor,
      limit,
      data,
    }
  }

  private setOffsetAndLimit(params: PagableParams): void {
    const { page, limit, FLAG_UNLIMITED } = params
    const offset = FLAG_UNLIMITED ? 0 : page * limit
    this.queryBuilder.offset(offset).limit(FLAG_UNLIMITED ? undefined : limit)
  }

  private async getMappedArray(): Promise<Array<TResult>> {
    // set data without storing result from getRawMany to prevent
    // large amount of data taking too much space in memory
    if (this.mapper) {
      return (await this.queryBuilder.getRawMany()).map(this.mapper)
    } else {
      return await this.queryBuilder.getRawMany()
    }
  }
}
