import { BaseProjector } from 'src/base-projectors/base-projector'
import {
  articleViewModelProjectionSelection,
  IArticleViewModelProjection,
  projectArticleViewModel,
} from 'src/modules/article/projectors/article-view-model.projector'
import { Repository } from 'typeorm'
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
    super.setMapper((projection) => {
      return {
        id: projection.historyId,
        article: projectArticleViewModel(projection, { stripBody: true }),
        createdAt: projection.historyCreatedAt,
      }
    })
  }
}
