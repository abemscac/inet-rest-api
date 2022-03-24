import { JSDOM } from 'jsdom'
import { BaseProjector } from 'src/base-projectors/base-projector'
import { Repository } from 'typeorm'
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
  articleLastModifiedAt?: Date
  authorId?: number
  authorUsername?: string
  authorName?: string
  authorAvatarImageHash?: string
  authorCreatedAt?: Date
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

interface IProjectArticleViewModelOptions {
  stripBody?: boolean
}

export const projectArticleViewModel = (
  projection: IArticleViewModelProjection,
  options?: IProjectArticleViewModelOptions,
): IArticleViewModel => {
  const body = !options?.stripBody
    ? projection.articleBody
    : new JSDOM(
        `<body>${projection.articleBody}</body>`,
      ).window.document.body.textContent.substring(0, 200)
  return {
    id: projection.articleId,
    category: {
      id: projection.articleCategoryId,
      code: projection.articleCategoryCode,
      imageUrl: projection.articleCategoryImageHash,
    },
    author: !projection.authorId
      ? null
      : {
          id: projection.authorId,
          username: projection.authorUsername,
          name: projection.authorName,
          avatarUrl: projection.authorAvatarImageHash,
          createdAt: projection.authorCreatedAt,
        },
    coverImageUrl: projection.articleCoverImageHash,
    title: projection.articleTitle,
    body,
    views: projection.articleViews,
    likes: Number(projection.articleLikes),
    createdAt: projection.articleCreatedAt,
    lastModifiedAt: projection.articleLastModifiedAt ?? null,
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
    super.setMapper((projection) =>
      projectArticleViewModel(projection, { stripBody: true }),
    )
  }
}
