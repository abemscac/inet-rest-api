import { Repository } from 'typeorm'
import {
  BaseProjector,
  IProjectionPipe,
} from '~/base-projectors/base-projector'
import { ImageSize, ImgurUtil } from '~/utils/imgur.util'
import { ArticleComment } from '../article-comment.entity'
import { IArticleCommentViewModel } from '../view-models/i-article-comment.view-model'

export interface IArticleCommentViewModelProjection {
  commentId: number
  commentBody: string | null
  commentCreatedAt: Date
  commentIsRemoved: boolean
  authorId: number | null
  authorUsername: string | null
  authorName: string | null
  authorAvatarImageHash: string | null
  authorAvatarImageExt: string | null
  authorCreatedAt: Date | null
}

export const ArticleCommentViewModelPipe: IProjectionPipe<
  IArticleCommentViewModel,
  IArticleCommentViewModelProjection
> = (result, projection) => {
  result.id = projection.commentId
  result.author = !projection.authorId
    ? null
    : {
        id: projection.authorId,
        username: projection.authorUsername as string,
        name: projection.authorName,
        avatarUrl: ImgurUtil.toLink({
          hash: projection.authorAvatarImageHash,
          ext: projection.authorAvatarImageExt,
          size: ImageSize.SmallSquare,
        }),
        createdAt: projection.authorCreatedAt as Date,
      }
  result.body = projection.commentBody
  result.createdAt = projection.commentCreatedAt
  result.isRemoved = projection.commentIsRemoved
  return result
}

export class ArticleCommentProjector extends BaseProjector<
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
          `(CASE WHEN (${alias}.isRemoved = 1 OR author.isRemoved = 1) THEN NULL ELSE author.avatarImageExt END) AS authorAvatarImageExt`,
          `(CASE WHEN (${alias}.isRemoved = 1 OR author.isRemoved = 1) THEN NULL ELSE author.createdAt END) AS authorCreatedAt`,
        ]),
      alias,
    )
    super.setPipes(ArticleCommentViewModelPipe)
  }
}
