import { Repository } from 'typeorm'
import { BaseProjector } from '~/base-projectors/base-projector'
import { ImageSize, ImgurUtil } from '~/utils/imgur.util'
import { ArticleCategory } from '../article-category.entity'
import { IArticleCategoryViewModel } from '../view-models/i-article-category.view-model'

export class ArticleCategoryProjector extends BaseProjector<
  ArticleCategory,
  IArticleCategoryViewModel
> {
  constructor(repository: Repository<ArticleCategory>, alias: string) {
    super(
      repository
        .createQueryBuilder(alias)
        .select([
          `${alias}.id AS id`,
          `${alias}.code AS code`,
          `${alias}.imageHash AS imageHash`,
          `${alias}.imageExt AS imageExt`,
        ]),
      alias,
    )
    super.setPipes((_, projection) => ({
      id: projection.id,
      code: projection.code,
      imageUrl:
        ImgurUtil.toLink({
          hash: projection.imageHash,
          ext: projection.imageExt,
          size: ImageSize.SmallSquare,
        }) ?? '',
    }))
  }
}
