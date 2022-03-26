import { JSDOM } from 'jsdom'
import { Repository } from 'typeorm'
import { BaseProjector, IProjectorPipe } from '~/base-projectors/base-projector'
import { Article } from '../article.entity'
import { IArticleViewModel } from '../view-models/i-article.view-model'

export interface IArticleViewModelProjection {
  articleCategoryId: number
  articleCategoryCode: string
  articleCategoryImageHash: string
  articleId: number
  articleCoverImageHash: string
  articleTitle: string
  articleBody: string
  articleViews: number
  articleLikes: number
  articleCreatedAt: Date
  articleLastModifiedAt: Date | null
  authorId: number | null
  authorUsername: string | null
  authorName: string | null
  authorAvatarImageHash: string | null
  authorCreatedAt: Date | null
}

export const articleViewModelProjectionSelection = [
  'articleCategory.id AS articleCategoryId',
  'articleCategory.code AS articleCategoryCode',
  'articleCategory.imageHash AS articleCategoryImageHash',
  'article.id AS articleId',
  'article.coverImageHash AS articleCoverImageHash',
  'article.title AS articleTitle',
  'article.body AS articleBody',
  'article.views AS articleViews',
  'COUNT(articleLike.user_id) AS articleLikes',
  'article.createdAt AS articleCreatedAt',
  'article.lastModifiedAt AS articleLastModifiedAt',
  '(CASE WHEN author.isRemoved = 1 THEN NULL ELSE author.id END) AS authorId',
  '(CASE WHEN author.isRemoved = 1 THEN NULL ELSE author.username END) AS authorUsername',
  '(CASE WHEN author.isRemoved = 1 THEN NULL ELSE author.name END) AS authorName',
  '(CASE WHEN author.isRemoved = 1 THEN NULL ELSE author.avatarImageHash END) as authorAvatarImageHash',
  '(CASE WHEN author.isRemoved = 1 THEN NULL ELSE author.createdAt END) as authorCreatedAt',
]

interface IArticleViewModelPipeOptions {
  stripBody: boolean
}

export const articleViewModelPipe = (
  options: IArticleViewModelPipeOptions,
): IProjectorPipe<IArticleViewModel, IArticleViewModelProjection> => {
  return (result, projection) => {
    const body = !options.stripBody
      ? projection.articleBody
      : (new JSDOM(
          `<body>${projection.articleBody}</body>`,
        ).window.document.body.textContent?.substring(0, 200) as string)

    result.id = projection.articleId
    result.category = {
      id: projection.articleCategoryId,
      code: projection.articleCategoryCode,
      imageUrl: projection.articleCategoryImageHash,
    }
    result.author = !projection.authorId
      ? null
      : {
          id: projection.authorId as number,
          username: projection.authorUsername as string,
          name: projection.authorName,
          avatarUrl: projection.authorAvatarImageHash,
          createdAt: projection.authorCreatedAt as Date,
        }
    result.coverImageUrl = projection.articleCoverImageHash
    result.title = projection.articleTitle
    result.body = body
    result.views = projection.articleViews
    result.likes = Number(projection.articleLikes)
    result.createdAt = projection.articleCreatedAt
    result.lastModifiedAt = projection.articleLastModifiedAt ?? null

    return result
  }
}

export class ArticleViewModelProjector extends BaseProjector<
  Article,
  IArticleViewModel,
  IArticleViewModelProjection
> {
  constructor(repository: Repository<Article>, alias: string) {
    super(
      repository
        .createQueryBuilder(alias)
        .innerJoin(`${alias}.category`, 'articleCategory')
        .leftJoin(
          'article_like',
          'articleLike',
          `${alias}.id = articleLike.article_id`,
        )
        .innerJoin('article.author', 'author')
        .select(articleViewModelProjectionSelection)
        .groupBy(`${alias}.id`),
      alias,
    )
    super.setPipes(articleViewModelPipe({ stripBody: true }))
  }
}
