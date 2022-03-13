import { SelectQueryBuilder } from 'typeorm'

export type IBaseProjectorMapper<TEntity, TResult> = (
  entity: TEntity,
) => TResult

export interface IBaseProjector<TEntity, TResult> {
  get sql(): string
  useAction(
    callback: (
      queryBuilder: SelectQueryBuilder<TEntity>,
    ) => Promise<TEntity | Array<TEntity>>,
  ): this
  useMapper(mapper: IBaseProjectorMapper<TEntity, TResult>): this
  project(): Promise<TResult>
  projectAll(): Promise<Array<TResult>>
}

export class BaseProjector<TEntity, TResult>
  implements IBaseProjector<TEntity, TResult>
{
  private action?: () => Promise<TEntity | Array<TEntity>>
  private mapper?: IBaseProjectorMapper<TEntity, TResult>

  constructor(private readonly queryBuilder: SelectQueryBuilder<TEntity>) {}

  get sql(): string {
    return this.queryBuilder.getSql()
  }

  useAction(
    callback: (
      queryBuilder: SelectQueryBuilder<TEntity>,
    ) => Promise<TEntity | TEntity[]>,
  ): this {
    this.action = () => callback(this.queryBuilder)
    return this
  }

  useMapper(mapper: (entity: TEntity) => TResult): this {
    this.mapper = mapper
    return this
  }

  async project(): Promise<TResult> {
    const value = await this.action()
    if (Array.isArray(value)) {
      throw new Error(
        'The action returned an array, but project is used. Do you mean to use "projectAll()"?',
      )
    } else {
      return this.mapper(value)
    }
  }

  async projectAll(): Promise<TResult[]> {
    const values = await this.action()
    if (Array.isArray(values)) {
      return values.map(this.mapper)
    } else {
      throw new Error(
        'The action returned an entity, but projectAll is used. Do you mean to use "project()"?',
      )
    }
  }
}
