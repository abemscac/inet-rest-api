import { ArticleLikeCreateForm } from './forms/article-like-create.form'
import { ArticleLikeDeleteByQueryParams } from './params/article-like-delete-by-query.params'
import { ArticleLikeFindByQueryParams } from './params/article-like-find-by-query.params'
import { IArticleLikeViewModel } from './view-models/i-article-like.view-model'

export interface IArticleLikeService {
  findByQuery(
    params: ArticleLikeFindByQueryParams,
  ): Promise<IArticleLikeViewModel>
  create(form: ArticleLikeCreateForm): Promise<IArticleLikeViewModel>
  deleteByQuery(params: ArticleLikeDeleteByQueryParams): Promise<void>
}
