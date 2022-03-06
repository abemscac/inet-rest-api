import { IsNotEmpty } from 'class-validator'

export class ArticleLikeCreateForm {
  @IsNotEmpty()
  articleId: number

  @IsNotEmpty()
  userId: number
}
