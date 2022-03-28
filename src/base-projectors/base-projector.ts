import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm'
import { PagableParams, Pagination } from '~/shared-params/pagable.params'
import { ICursorPaginationViewModel } from '~/shared-view-models/i-cursor-pagination.view-model'
import { IPagableViewModel } from '~/shared-view-models/i-pagable.view-model'
import { IPaginationViewModel } from '~/shared-view-models/i-pagination.view-model'

export type IProjectionPipe<TResult, TProjection> = (
  result: Partial<TResult>,
  projection: Readonly<TProjection>,
) => Partial<TResult>

export interface IBaseProjector<TResult extends Record<string, unknown>> {
  getSql(): string
  where(where: string, parameters: ObjectLiteral): this
  andWhere(where: string, parameters: ObjectLiteral): this
  orderBy(sort: string, order?: 'ASC' | 'DESC'): this
  project(): Promise<TResult>
  projectOrFail(): Promise<TResult>
  projectMany(): Promise<Array<TResult>>
  /**
   * You shou validate the params by {@link src/shared-params/pagable.params.ts} first.
   */
  projectPagination(params: PagableParams): Promise<IPagableViewModel<TResult>>
}

export class BaseProjector<
  TEntity,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TResult extends Record<string, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TProjection extends Record<string, any> = TEntity,
> implements IBaseProjector<TResult>
{
  private pipes: Array<IProjectionPipe<TResult, TProjection>> = []

  constructor(
    private readonly queryBuilder: SelectQueryBuilder<TEntity>,
    private readonly alias: string,
  ) {}

  getSql(): string {
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

  protected setPipes(
    ...pipes: Array<IProjectionPipe<TResult, TProjection>>
  ): this {
    this.pipes = pipes
    return this
  }

  async project(): Promise<TResult> {
    return this.pipeProjectionToResult(await this.queryBuilder.getRawOne())
  }

  async projectOrFail(): Promise<TResult> {
    const projection = await this.queryBuilder.getRawOne()
    if (!projection) {
      throw new NotFoundException()
    }
    return this.pipeProjectionToResult(projection)
  }

  async projectMany(): Promise<Array<TResult>> {
    // Set data without storing result from getRawMany to prevent
    // large amount of data taking too much space in memory.
    if (this.pipes.length) {
      return (await this.queryBuilder.getRawMany()).map(
        this.pipeProjectionToResult.bind(this),
      )
    } else {
      return await this.queryBuilder.getRawMany()
    }
  }

  async projectPagination(
    params: PagableParams,
  ): Promise<IPagableViewModel<TResult>> {
    const { pagination } = params
    if (!pagination) {
      this.setOffsetAndLimit(params)
      return await this.projectMany()
    } else if (pagination === Pagination.basic) {
      return await this.projectBasicPagination(params)
    } else if (pagination === Pagination.cursor) {
      return await this.projectCursorPagination(params)
    } else {
      throw new BadRequestException(`Unknown pagination '${pagination}'.`)
    }
  }

  private async projectBasicPagination(
    params: PagableParams,
  ): Promise<IPaginationViewModel<TResult>> {
    const { page, limit, FLAG_UNLIMITED } = params

    const totalCount = await this.queryBuilder.getCount()
    const totalPages = FLAG_UNLIMITED
      ? Number(totalCount > 0)
      : Math.ceil(totalCount / (limit as number))

    this.setOffsetAndLimit(params)
    const data = await this.projectMany()

    return {
      page: FLAG_UNLIMITED ? 0 : (page as number),
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
    const data = await this.projectMany()

    return {
      cursor: cursor as number,
      limit: limit as number,
      data,
    }
  }

  private setOffsetAndLimit(params: PagableParams): void {
    const { page, limit, FLAG_UNLIMITED } = params
    const offset = FLAG_UNLIMITED ? 0 : (page as number) * (limit as number)
    this.queryBuilder.offset(offset).limit(FLAG_UNLIMITED ? undefined : limit)
  }

  private pipeProjectionToResult(projection?: TProjection): TResult {
    if (!projection) {
      throw new InternalServerErrorException(
        `The projection to be piped must be truthy, but got ${projection}.`,
      )
    }
    return (
      !this.pipes.length
        ? projection
        : this.pipes.reduce(
            (result, nextPipe) => nextPipe(result, projection),
            {} as Partial<TResult>,
          )
    ) as TResult
  }
}
