import { IsInt, IsNotEmpty } from 'class-validator'

export class ArticleCommentCreateForm {
  @IsNotEmpty()
  @IsInt()
  articleId: number

  @IsNotEmpty()
  body: string
}
