import {
  BaseProjector,
  IBaseProjector,
} from 'src/base-projectors/base-projector'
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

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IArticleCommentViewModelProjector
  extends IBaseProjector<IArticleCommentViewModel> {}

export class ArticleCommentViewModelProjector
  extends BaseProjector<
    ArticleComment,
    IArticleCommentViewModel,
    IArticleCommentViewModelProjection
  >
  implements IArticleCommentViewModelProjector
{
  constructor(repository: Repository<ArticleComment>) {
    super(
      repository
        .createQueryBuilder('comment')
        .innerJoin('comment.author', 'author')
        .select([
          'comment.id AS commentId',
          '(CASE WHEN comment.isRemoved = 1 THEN NULL ELSE comment.body END) AS commentBody',
          'comment.createdAt AS commentCreatedAt',
          'comment.isRemoved AS commentIsRemoved',
          '(CASE WHEN (comment.isRemoved = 1 OR author.isRemoved = 1) THEN NULL ELSE author.id END) AS authorId',
          '(CASE WHEN (comment.isRemoved = 1 OR author.isRemoved = 1) THEN NULL ELSE author.username END) AS authorUsername',
          '(CASE WHEN (comment.isRemoved = 1 OR author.isRemoved = 1) THEN NULL ELSE author.name END) AS authorName',
          '(CASE WHEN (comment.isRemoved = 1 OR author.isRemoved = 1) THEN NULL ELSE author.avatarUrl END) AS authorAvatarUrl',
          '(CASE WHEN (comment.isRemoved = 1 OR author.isRemoved = 1) THEN NULL ELSE author.createdAt END) AS authorCreatedAt',
        ]),
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
