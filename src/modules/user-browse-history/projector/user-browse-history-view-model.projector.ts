import { Repository } from 'typeorm'
import { BaseProjector } from '~/base-projectors/base-projector'
import {
  articleViewModelPipe,
  articleViewModelProjectionSelection,
  IArticleViewModelProjection,
} from '~/modules/article/projectors/article-view-model.projector'
import { IArticleViewModel } from '~/modules/article/view-models/i-article.view-model'
import { UserBrowseHistory } from '../user-browse-history.entity'
import { IUserBrowseHistoryViewModel } from '../view-models/i-user-browse-history.view-model'

interface IUserBrowseHistoryViewModelProjection
  extends IArticleViewModelProjection {
  historyId: number
  historyCreatedAt: Date
}

export class UserBrowseHistoryViewModelProjector extends BaseProjector<
  UserBrowseHistory,
  IUserBrowseHistoryViewModel,
  IUserBrowseHistoryViewModelProjection
> {
  constructor(repository: Repository<UserBrowseHistory>, alias: string) {
    super(
      repository
        .createQueryBuilder(alias)
        .innerJoin(`${alias}.article`, 'article')
        .innerJoin('article.category', 'articleCategory')
        .leftJoin(
          'article_like',
          'articleLike',
          'article.id = articleLike.article_id',
        )
        .innerJoin('article.author', 'author')
        .select([
          `${alias}.id AS historyId`,
          `${alias}.createdAt AS historyCreatedAt`,
          ...articleViewModelProjectionSelection,
        ])
        .groupBy('article.id'),
      alias,
    )
    super.setPipes((_, projection) => ({
      id: projection.historyId,
      article: articleViewModelPipe({ stripBody: true })(
        {},
        projection,
      ) as IArticleViewModel,
      createdAt: projection.historyCreatedAt,
    }))
  }
}
