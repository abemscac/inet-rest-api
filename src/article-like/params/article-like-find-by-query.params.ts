import { IsNotEmpty } from 'class-validator'

export class ArticleLikeFindByQueryParams {
  @IsNotEmpty()
  articleId: number

  @IsNotEmpty()
  userId: number
}
