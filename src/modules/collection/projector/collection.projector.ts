import { Repository } from 'typeorm'
import { BaseProjector } from '~/base-projectors/base-projector'
import {
  ArticleProjectionPipe,
  ArticleProjectionSelection,
  IArticleProjection,
} from '~/modules/article/projectors/article.projector'
import { IArticleViewModel } from '~/modules/article/view-models/i-article.view-model'
import { Collection } from '../collection.entity'
import { ICollectionViewModel } from '../view-models/i-collection.view-model'

interface ICollectionProjection extends IArticleProjection {
  collectionId: number
  collectionCreatedAt: Date
}

export class CollectionProjector extends BaseProjector<
  Collection,
  ICollectionViewModel,
  ICollectionProjection
> {
  constructor(
    repository: Repository<Collection>,
    alias: string,
    userId: number,
  ) {
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
        .leftJoin(
          'article_like',
          'likeRecord',
          [
            `article.id = likeRecord.article_id`,
            'likeRecord.user_id = :userId',
          ].join(' AND '),
          { userId },
        )
        .innerJoin('article.author', 'author')
        .select([
          ...ArticleProjectionSelection,
          `${alias}.id AS collectionId`,
          `${alias}.createdAt AS collectionCreatedAt`,
        ])
        .groupBy('article.id'),
      alias,
    )
    super.setPipes((_, projection) => ({
      id: projection.collectionId,
      article: ArticleProjectionPipe({ stripBody: true })(
        {},
        projection,
      ) as IArticleViewModel,
      createdAt: projection.collectionCreatedAt,
    }))
  }
}
