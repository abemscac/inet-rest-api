import { IsDecimal, IsNotEmpty } from 'class-validator'

export class ArticleCommentCreateForm {
  @IsNotEmpty()
  @IsDecimal()
  authorId: number

  @IsNotEmpty()
  @IsDecimal()
  articleId: number

  @IsNotEmpty()
  body: string
}
