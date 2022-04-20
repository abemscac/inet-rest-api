import { Repository } from 'typeorm'
import { BaseProjector } from '~/base-projectors/base-projector'
import { ImageSize, ImgurUtil } from '~/utils/imgur.util'
import { ArticleCategory } from '../article-category.entity'
import { IArticleCategoryDetailViewModel } from '../view-models/i-article-category-detail.view-model'

export type IArticleCategoryDetailProjection = Pick<
  ArticleCategory,
  'code' | 'imageHash' | 'imageExt'
> & {
  newArticleCountToday: number
}

export class ArticleCategoryDetailProjector extends BaseProjector<
  ArticleCategory,
  IArticleCategoryDetailViewModel,
  IArticleCategoryDetailProjection
> {
  constructor(repository: Repository<ArticleCategory>, alias: string) {
    super(
      repository
        .createQueryBuilder(alias)
        .leftJoin(
          'article',
          'article',
          [
            `${alias}.id = article.category_id`,
            'article.createdAt >= CURDATE()',
            'article.createdAt < (CURDATE() + INTERVAL 1 DAY)',
          ].join(' AND '),
        )
        .select([
          `${alias}.code AS code`,
          `${alias}.imageHash AS imageHash`,
          `${alias}.imageExt AS imageExt`,
          `COUNT(article.id) AS newArticleCountToday`,
        ]),
      alias,
    )
    super.setPipes((_, projection) => ({
      code: projection.code,
      imageUrl:
        ImgurUtil.toLink({
          hash: projection.imageHash,
          ext: projection.imageExt,
          size: ImageSize.SmallSquare,
        }) ?? '',
      newArticleCountToday: projection.newArticleCountToday,
    }))
  }
}
