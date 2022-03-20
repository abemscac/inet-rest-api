import { JSDOM } from 'jsdom'
import { BaseProjector } from 'src/base-projectors/base-projector'
import { Repository } from 'typeorm'
import { UserBrowseHistory } from '../user-browse-history.entity'
import { IUserBrowseHistoryViewModel } from '../view-models/i-user-browse-history.view-model'

interface IUserBrowseHistoryViewModelProjection {
  historyId: number
  historyCreatedAt: Date
  articleCategoryId: number
  articleCategoryCode: string
  articleCategoryImageUrl: string
  articleId: number
  articleCoverImageUrl: string
  articleTitle: string
  articleBody: string
  articleViews: number
  articleLikes: number
  articleCreatedAt: Date
  authorId?: number
  authorUsername?: string
  authorName?: string
  authorAvatarUrl?: string
  authorCreatedAt?: Date
}

export class UserBrowseHistoryViewModelProjector extends BaseProjector<
  UserBrowseHistory,
  IUserBrowseHistoryViewModel,
  IUserBrowseHistoryViewModelProjection
> {
  constructor(repository: Repository<UserBrowseHistory>, alias: string) {
    super(
      repository
        .createQueryBuilder(alias)
        .innerJoin(`${alias}.article`, 'article')
        .innerJoin('article.category', 'articleCategory')
        .innerJoin(
          'article_like',
          'articleLike',
          'article.id = articleLike.article_id',
        )
        .innerJoin('article.author', 'author')
        .select([
          `${alias}.id AS historyId`,
          `${alias}.createdAt AS historyCreatedAt`,
          'articleCategory.id AS articleCategoryId',
          'articleCategory.code AS articleCategoryCode',
          'articleCategory.imageUrl AS articleCategoryImageUrl',
          'article.id AS articleId',
          'article.coverImageUrl AS articleCoverImageUrl',
          'article.title AS articleTitle',
          'article.body AS articleBody',
          'article.views AS articleViews',
          'COUNT(articleLike.user_id) AS articleLikes',
          'article.createdAt AS articleCreatedAt',
          '(CASE WHEN author.isRemoved = 1 THEN NULL ELSE author.id END) AS authorId',
          '(CASE WHEN author.isRemoved = 1 THEN NULL ELSE author.username END) AS authorUsername',
          '(CASE WHEN author.isRemoved = 1 THEN NULL ELSE author.name END) AS authorName',
          '(CASE WHEN author.isRemoved = 1 THEN NULL ELSE author.avatarUrl END) as authorAvatarUrl',
          '(CASE WHEN author.isRemoved = 1 THEN NULL ELSE author.createdAt END) as authorCreatedAt',
        ])
        .groupBy('article.id'),
      alias,
    )
    super.setMapper((projection) => {
      const strippedBody = new JSDOM(
        `<body>${projection.articleBody}</body>`,
      ).window.document.body.textContent.substring(0, 200)
      return {
        id: projection.historyId,
        article: {
          id: projection.articleId,
          category: {
            id: projection.articleCategoryId,
            code: projection.articleCategoryCode,
            imageUrl: projection.articleCategoryImageUrl,
          },
          author: {
            id: projection.authorId,
            username: projection.authorUsername,
            name: projection.authorName,
            avatarUrl: projection.authorAvatarUrl,
            createdAt: projection.authorCreatedAt,
          },
          coverImageUrl: projection.articleCoverImageUrl,
          title: projection.articleTitle,
          body: strippedBody,
          views: projection.articleViews,
          likes: projection.articleLikes,
          createdAt: projection.articleCreatedAt,
        },
        createdAt: projection.historyCreatedAt,
      }
    })
  }
}
