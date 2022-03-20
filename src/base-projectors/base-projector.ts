import { BadRequestException } from '@nestjs/common'
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
  orderBy(sort: string, order?: 'ASC' | 'DESC'): this
  project(): Promise<T>
  projectMany(): Promise<Array<T>>
  /**
   * You shou validate the params by {@link src/shared-params/pagable.params.ts} first.
   */
  projectPagination(
    params: PagableParams,
    /**
     * Used to set query 'where {alias}.id > :cursor' when using cursor pagination.
     */
    alias: string,
  ): Promise<IPagableViewModel<T>>
}

export class BaseProjector<TEntity, TResult, TProjection = TEntity>
  implements IBaseProjector<TResult>
{
  private mapper?: IBaseProjectorMapper<TProjection, TResult>

  constructor(private readonly queryBuilder: SelectQueryBuilder<TEntity>) {}

  get sql(): string {
    return this.queryBuilder.getSql()
  }

  where(where: string, parameters: ObjectLiteral): this {
    this.queryBuilder.where(where, parameters)
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
    return this.mapper(projection, 0, [projection])
  }

  async projectMany(): Promise<TResult[]> {
    const projections = await this.queryBuilder.getRawMany()
    return projections.map(this.mapper)
  }

  async projectPagination(
    params: PagableParams,
    alias: string,
  ): Promise<IPagableViewModel<TResult>> {
    const { pagination } = params
    if (!pagination) {
      this.setOffsetAndLimit(params)
      return await this.projectMany()
    } else if (pagination === Pagination.default) {
      return await this.projectDefaultPagination(params)
    } else if (pagination === Pagination.cursor) {
      return await this.projectCursorPagination(params, alias)
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
    const data = (await this.queryBuilder.take(1).getRawMany()).map(this.mapper)

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
    alias: string,
  ): Promise<ICursorPaginationViewModel<TResult>> {
    if (!alias) {
      throw new BadRequestException(
        `Param 'alias' must be provided when using cursor pagination in projector.`,
      )
    }
    const { limit, cursor } = params
    this.queryBuilder.where(`${alias}.id > :cursor`, { cursor })
    this.setOffsetAndLimit(params)

    const data = (await this.queryBuilder.getRawMany()).map(this.mapper)
    return {
      cursor,
      limit,
      data,
    }
  }

  private setOffsetAndLimit = (params: PagableParams): void => {
    const { page, limit, FLAG_UNLIMITED } = params
    const offset = FLAG_UNLIMITED ? 0 : page * limit
    this.queryBuilder.offset(offset).limit(FLAG_UNLIMITED ? undefined : limit)
  }
}
