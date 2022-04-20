import { Repository } from 'typeorm'
import { BaseProjector } from '~/base-projectors/base-projector'
import { Article } from '../article.entity'
import { IArticleDetailViewModel } from '../view-models/i-article-detail.view-model'
import {
  ArticleProjectionPipe,
  ArticleProjectionSelection,
  IArticleProjection,
} from './article.projector'

export interface IArticleDetailProjection extends IArticleProjection {
  collectionId: number | null
}

export class ArticleDetailProjector extends BaseProjector<
  Article,
  IArticleDetailViewModel,
  IArticleDetailProjection
> {
  constructor(
    repository: Repository<Article>,
    alias: string,
    userId: number | undefined,
  ) {
    super(
      repository
        .createQueryBuilder(alias)
        .innerJoin(`${alias}.category`, 'articleCategory')
        .leftJoin(
          'article_like',
          'articleLike',
          `${alias}.id = articleLike.article_id`,
        )
        .leftJoin(
          'article_like',
          'likeRecord',
          `${alias}.id = likeRecord.article_id AND likeRecord.user_id = :userId`,
          { userId },
        )
        .leftJoin(
          'collection',
          'collection',
          `${alias}.id = collection.article_id AND collection.user_id = :userId`,
          { userId },
        )
        .innerJoin('article.author', 'author')
        .select([
          ...ArticleProjectionSelection,
          'collection.id AS collectionId',
        ]),
      alias,
    )
    super.setPipes(
      ArticleProjectionPipe({ stripBody: false }),
      (result, projection) => {
        result.likeId = projection.likeId ?? null
        result.collectionId = projection.collectionId ?? null
        return result
      },
    )
  }
}
