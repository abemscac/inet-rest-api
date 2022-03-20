import { BaseProjector } from 'src/base-projectors/base-projector'
import { Repository } from 'typeorm'
import { ArticleCategory } from '../article-category.entity'
import { IArticleCategoryViewModel } from '../view-models/i-article-category.view-model'

export class ArticleCategoryViewModelProjector extends BaseProjector<
  ArticleCategory,
  IArticleCategoryViewModel
> {
  constructor(repository: Repository<ArticleCategory>, alias: string) {
    super(
      repository
        .createQueryBuilder(alias)
        .select([`${alias}.id`, `${alias}.code`, `${alias}.imageUrl`]),
      alias,
    )
  }
}
