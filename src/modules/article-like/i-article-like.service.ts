import { IBaseService } from 'src/base-service/i-base.service'
import { ArticleLike } from './article-like.entity'
import { ArticleLikeCreateForm } from './forms/article-like-create.form'
import { ArticleLikeFindOneByQueryParams } from './params/article-like-find-one-by-query.params'

export interface IArticleLikeService extends IBaseService {
  findOneByQuery(params: ArticleLikeFindOneByQueryParams): Promise<ArticleLike>
  create(form: ArticleLikeCreateForm): Promise<ArticleLike>
  deleteOneByQuery(params: ArticleLikeFindOneByQueryParams): Promise<void>
}
