import { IBaseService } from 'src/base-service/i-base.service'
import { IPagableViewModel } from 'src/shared-view-models/i-pagable.view-model'
import { ArticleCreateForm } from './forms/article-create.form'
import { ArticleUpdateForm } from './forms/article-update.form'
import { ArticleFindMostPopularByQueryParams } from './params/article-find-most-popular-by-query.params'
import { IArticleViewModel } from './view-models/i-article.view-model'

export interface IArticleService extends IBaseService {
  // findById(id: number): Promise<IArticleViewModel>
  // findMostPopularByQuery(
  //   params: ArticleFindMostPopularByQueryParams,
  // ): Promise<IPagableViewModel<IArticleViewModel>>
  // create(form: ArticleCreateForm): Promise<IArticleViewModel>
  // updateById(id: number, form: ArticleUpdateForm): Promise<IArticleViewModel>
  // removeById(id: number): Promise<void>
}
