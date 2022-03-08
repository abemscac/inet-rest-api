import { IPaginationViewModel } from 'src/shared-view-models/i-pagination.view-model'
import { ArticleCommentCreateForm } from './forms/article-comment-create.form'
import { ArticleCommentFindByQueryParams } from './params/article-comment-find-by-query.params'
import { IArticleCommentViewModel } from './view-models/i-article-comment.view-model'

export interface IArticleCommentService {
  findByQueryPagination(
    params: ArticleCommentFindByQueryParams,
  ): Promise<IPaginationViewModel<IArticleCommentViewModel>>
  create(form: ArticleCommentCreateForm): Promise<IArticleCommentViewModel>
  removeById(id: number): Promise<void>
}
