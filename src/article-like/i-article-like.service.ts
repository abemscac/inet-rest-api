import { ArticleLike } from './article-like.entity'
import { ArticleLikeCreateForm } from './forms/article-like-create.form'
import { ArticleLikeDeleteByQueryParams } from './params/article-like-delete-by-query.params'
import { ArticleLikeFindByQueryParams } from './params/article-like-find-by-query.params'

export interface IArticleLikeService {
  findOneByQuery(params: ArticleLikeFindByQueryParams): Promise<ArticleLike>
  create(form: ArticleLikeCreateForm): Promise<ArticleLike>
  deleteOneByQuery(params: ArticleLikeDeleteByQueryParams): Promise<void>
}
