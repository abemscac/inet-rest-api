import { BaseProjector } from 'src/base-projectors/base-projector'
import { Repository } from 'typeorm'
import { ArticleComment } from '../article-comment.entity'
import { IArticleCommentViewModel } from '../view-models/i-article-comment.view-model'

interface IArticleCommentViewModelProjection {
  commentId: number
  commentBody: string
  commentCreatedAt: Date
  commentIsRemoved: boolean
  authorId?: number
  authorUsername?: string
  authorName?: string
  authorAvatarUrl?: string
  authorCreatedAt?: Date
}

export class ArticleCommentViewModelProjector extends BaseProjector<
  ArticleComment,
  IArticleCommentViewModel,
  IArticleCommentViewModelProjection
> {
  constructor(repository: Repository<ArticleComment>, alias: string) {
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
          `(CASE WHEN (${alias}.isRemoved = 1 OR author.isRemoved = 1) THEN NULL ELSE author.avatarUrl END) AS authorAvatarUrl`,
          `(CASE WHEN (${alias}.isRemoved = 1 OR author.isRemoved = 1) THEN NULL ELSE author.createdAt END) AS authorCreatedAt`,
        ]),
      alias,
    )
    super.setMapper((projection) => ({
      id: projection.commentId,
      author: !projection.authorId
        ? undefined
        : {
            id: projection.authorId,
            username: projection.authorUsername,
            name: projection.authorName,
            avatarUrl: projection.authorAvatarUrl,
            createdAt: projection.authorCreatedAt,
          },
      body: projection.commentBody,
      createdAt: projection.commentCreatedAt,
      isRemoved: projection.commentIsRemoved,
    }))
  }
}
