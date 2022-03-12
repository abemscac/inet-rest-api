import { IPagableViewModel } from 'src/shared-view-models/i-pagable.view-model'
import { ArticleCommentCreateForm } from './forms/article-comment-create.form'
import { ArticleCommentFindByQueryParams } from './params/article-comment-find-by-query.params'
import { IArticleCommentViewModel } from './view-models/i-article-comment.view-model'

export interface IArticleCommentService {
  findByQuery(
    params: ArticleCommentFindByQueryParams,
  ): Promise<IPagableViewModel<IArticleCommentViewModel>>
  create(form: ArticleCommentCreateForm): Promise<IArticleCommentViewModel>
  removeById(id: number): Promise<void>
}