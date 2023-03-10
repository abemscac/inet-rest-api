import { InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm'
import { PagableQuery } from '~/shared-queries/pagable.query'
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
  projectPagination(query: PagableQuery): Promise<IPaginationViewModel<TResult>>
}

export class BaseProjector<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TEntity extends Record<string, any>,
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
    query: PagableQuery,
  ): Promise<IPaginationViewModel<TResult>> {
    const { page, limit } = query

    // Calculate totalCount and totalPages
    const totalCount = await this.queryBuilder.getCount()
    const totalPages = Math.ceil(totalCount / limit)

    // Set offset
    const offset = page * limit
    this.queryBuilder.offset(offset).limit(limit)

    const data = await this.projectMany()

    return {
      page: page,
      limit: limit,
      totalCount,
      totalPages,
      data,
    }
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
