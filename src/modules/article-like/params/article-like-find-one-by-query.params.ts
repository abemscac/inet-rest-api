import { IsNotEmpty } from 'class-validator'

export class ArticleLikeFindOneByQueryParams {
  @IsNotEmpty()
  articleId: number

  @IsNotEmpty()
  userId: number
}
