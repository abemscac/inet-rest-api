import { IsInt, IsNotEmpty } from 'class-validator'

export class ArticleUpdateForm {
  @IsNotEmpty()
  @IsInt()
  categoryId: number

  @IsNotEmpty()
  coverImageUrl: string

  @IsNotEmpty()
  title: string

  @IsNotEmpty()
  body: string
}
