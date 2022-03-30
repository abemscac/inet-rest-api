import { JSDOM } from 'jsdom'
import { Repository } from 'typeorm'
import {
  BaseProjector,
  IProjectionPipe,
} from '~/base-projectors/base-projector'
import { ImageSize, ImgurUtil } from '~/utils/imgur.util'
import { Article } from '../article.entity'
import { IArticleViewModel } from '../view-models/i-article.view-model'

export const ARTICLE_BODY_PREVIEW_LENGTH = 200

export interface IArticleProjection {
  articleCategoryCode: string
  articleCategoryImageHash: string
  articleCategoryImageExt: string
  articleId: number
  articleCoverImageHash: string
  articleCoverImageExt: string
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
  authorAvatarImageExt: string | null
  authorCreatedAt: Date | null
}

export const ArticleProjectionSelection = [
  'articleCategory.code AS articleCategoryCode',
  'articleCategory.imageHash AS articleCategoryImageHash',
  'articleCategory.imageExt AS articleCategoryImageExt',
  'article.id AS articleId',
  'article.coverImageHash AS articleCoverImageHash',
  'article.coverImageExt AS articleCoverImageExt',
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
  '(CASE WHEN author.isRemoved = 1 THEN NULL ELSE author.avatarImageExt END) as authorAvatarImageExt',
  '(CASE WHEN author.isRemoved = 1 THEN NULL ELSE author.createdAt END) as authorCreatedAt',
]

interface IArticleProjectionPipeOptions {
  stripBody: boolean
}

export const ArticleProjectionPipe = (
  options: IArticleProjectionPipeOptions,
): IProjectionPipe<IArticleViewModel, IArticleProjection> => {
  return (result, projection) => {
    const body = !options.stripBody
      ? projection.articleBody
      : (new JSDOM(
          `<body>${projection.articleBody}</body>`,
        ).window.document.body.textContent?.substring(
          0,
          ARTICLE_BODY_PREVIEW_LENGTH,
        ) as string)

    result.id = projection.articleId
    result.category = {
      code: projection.articleCategoryCode,
      imageUrl:
        ImgurUtil.toLink({
          hash: projection.articleCategoryImageHash,
          ext: projection.articleCategoryImageExt,
          size: ImageSize.SmallSquare,
        }) ?? '',
    }
    result.author = !projection.authorId
      ? null
      : {
          id: Number(projection.authorId),
          username: projection.authorUsername as string,
          name: projection.authorName,
          avatarUrl: ImgurUtil.toLink({
            hash: projection.authorAvatarImageHash,
            ext: projection.authorAvatarImageExt,
            size: ImageSize.SmallSquare,
          }),
          createdAt: projection.authorCreatedAt as Date,
        }
    result.coverImageUrl =
      ImgurUtil.toLink({
        hash: projection.articleCoverImageHash,
        ext: projection.articleCoverImageExt,
        size: ImageSize.HugeThumbnail,
      }) ?? ''
    result.title = projection.articleTitle
    result.body = body
    result.views = projection.articleViews
    result.likes = Number(projection.articleLikes)
    result.createdAt = projection.articleCreatedAt
    result.lastModifiedAt = projection.articleLastModifiedAt ?? null

    return result
  }
}

export class ArticleProjector extends BaseProjector<
  Article,
  IArticleViewModel,
  IArticleProjection
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
        .select(ArticleProjectionSelection)
        .groupBy(`${alias}.id`),
      alias,
    )
    super.setPipes(ArticleProjectionPipe({ stripBody: true }))
  }
}
