import { Repository } from 'typeorm'
import { BaseProjector } from '~/base-projectors/base-projector'
import { ArticleComment } from '../article-comment.entity'
import { IArticleCommentViewModel } from '../view-models/i-article-comment.view-model'

interface IArticleCommentViewModelProjection {
  commentId: number
  commentBody: string | null
  commentCreatedAt: Date
  commentIsRemoved: boolean
  authorId: number | null
  authorUsername: string | null
  authorName: string | null
  authorAvatarImageHash: string | null
  authorCreatedAt: Date | null
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
          `(CASE WHEN (${alias}.isRemoved = 1 OR author.isRemoved = 1) THEN NULL ELSE author.avatarImageHash END) AS authorAvatarImageHash`,
          `(CASE WHEN (${alias}.isRemoved = 1 OR author.isRemoved = 1) THEN NULL ELSE author.createdAt END) AS authorCreatedAt`,
        ]),
      alias,
    )
    super.setPipes((_, projection) => ({
      id: projection.commentId,
      author: !projection.authorId
        ? null
        : {
            id: projection.authorId,
            username: projection.authorUsername as string,
            name: projection.authorName,
            avatarUrl: projection.authorAvatarImageHash,
            createdAt: projection.authorCreatedAt as Date,
          },
      body: projection.commentBody,
      createdAt: projection.commentCreatedAt,
      isRemoved: projection.commentIsRemoved,
    }))
  }
}
