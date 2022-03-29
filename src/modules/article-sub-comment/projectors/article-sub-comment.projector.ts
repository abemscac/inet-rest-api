import { Repository } from 'typeorm'
import { BaseProjector } from '~/base-projectors/base-projector'
import {
  ArticleCommentViewModelPipe,
  IArticleCommentViewModelProjection,
} from '~/modules/article-comment/projectors/article-comment.projector'
import { IArticleCommentViewModel } from '~/modules/article-comment/view-models/i-article-comment.view-model'
import { ArticleSubComment } from '../article-sub-comment.entity'

export class ArticleSubCommentProjector extends BaseProjector<
  ArticleSubComment,
  IArticleCommentViewModel,
  IArticleCommentViewModelProjection
> {
  constructor(repository: Repository<ArticleSubComment>, alias: string) {
    super(
      repository
        .createQueryBuilder(alias)
        .innerJoin(`${alias}.author`, 'author')
        .select([
          `${alias}.id AS commentId`,
          `(CASE WHEN ${alias}.isRemoved = 1 THEN NULL ELSE ${alias}.body END) AS commentBody`,
          `${alias}.createdAt AS commentCreatedAt`,
          `${alias}.isRemoved AS commentIsRemoved`,
          `(CASE WHEN (${alias}.isRemoved = 1 OR author.isRemoved = 1) THEN NULL ELSE author.id END) AS authorId`,
          `(CASE WHEN (${alias}.isRemoved = 1 OR author.isRemoved = 1) THEN NULL ELSE author.username END) AS authorUsername`,
          `(CASE WHEN (${alias}.isRemoved = 1 OR author.isRemoved = 1) THEN NULL ELSE author.name END) AS authorName`,
          `(CASE WHEN (${alias}.isRemoved = 1 OR author.isRemoved = 1) THEN NULL ELSE author.avatarImageHash END) AS authorAvatarImageHash`,
          `(CASE WHEN (${alias}.isRemoved = 1 OR author.isRemoved = 1) THEN NULL ELSE author.avatarImageExt END) AS authorAvatarImageExt`,
          `(CASE WHEN (${alias}.isRemoved = 1 OR author.isRemoved = 1) THEN NULL ELSE author.createdAt END) AS authorCreatedAt`,
        ]),
      alias,
    )
    super.setPipes(ArticleCommentViewModelPipe)
  }
}
