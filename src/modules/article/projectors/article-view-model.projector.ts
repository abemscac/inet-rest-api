import { BaseProjector } from 'src/base-projectors/base-projector'
import { Repository } from 'typeorm'
import { Article } from '../article.entity'
import { IArticleViewModel } from '../view-models/i-article.view-model'

interface IArticleViewModelProjection {
  articleId: number
  articleCoverImageUrl: string
  articleTitle: string
  articleBody: string
  articleViews: number
  articleLikes: number
  articleCreatedAt: Date
  articleLastModifiedAt?: Date
  articleCategoryId: number
  articleCategoryCode: string
  articleCategoryImageUrl: string
  authorId?: number
  authorUsername?: string
  authorName?: string
  authorAvatarUrl?: string
  authorCreatedAt?: Date
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
        .innerJoin(`${alias}.category`, 'category')
        .innerJoin(`${alias}.author`, 'author')
        .innerJoin(
          'article_like',
          'articleLike',
          'article.id = articleLike.article_id',
        )
        .select([
          `${alias}.id AS articleId`,
          `${alias}.coverImageUrl AS articleCoverImageUrl`,
          `${alias}.title AS articleTitle`,
          `${alias}.body AS articleBody`,
          `${alias}.views AS articleViews`,
          `${alias}.createdAt AS articleCreatedAt`,
          `${alias}.lastModifiedAt AS articleLastModifiedAt`,
          'COUNT(articleLike.user_id) AS articleLikes',
          'category.id AS articleCategoryId',
          'category.code AS articleCategoryCode',
          'category.imageUrl AS articleCategoryImageUrl',
          '(CASE WHEN author.isRemoved = 1 THEN NULL ELSE author.id END) AS authorId',
          '(CASE WHEN author.isRemoved = 1 THEN NULL ELSE author.username END) AS authorUsername',
          '(CASE WHEN author.isRemoved = 1 THEN NULL ELSE author.name END) AS authorName',
          '(CASE WHEN author.isRemoved = 1 THEN NULL ELSE author.avatarUrl END) AS authorAvatarUrl',
          '(CASE WHEN author.isRemoved = 1 THEN NULL ELSE author.createdAt END) AS authorCreatedAt',
        ])
        .groupBy(`${alias}.id`),
    )
    super.setMapper((projection) => ({
      id: projection.articleId,
      category: {
        id: projection.articleCategoryId,
        code: projection.articleCategoryCode,
        imageUrl: projection.articleCategoryImageUrl,
      },
      author: !projection.authorId
        ? undefined
        : {
            id: projection.authorId,
            username: projection.authorUsername,
            name: projection.authorName,
            avatarUrl: projection.authorAvatarUrl,
            createdAt: projection.authorCreatedAt,
          },
      coverImageUrl: projection.articleCoverImageUrl,
      title: projection.articleTitle,
      body: projection.articleBody,
      views: projection.articleViews,
      likes: Number(projection.articleLikes),
      createdAt: projection.articleCreatedAt,
      lastModifiedAt: projection.articleLastModifiedAt,
    }))
  }
}
