import { IsDecimal, IsNotEmpty } from 'class-validator'

export class ArticleCreateForm {
  @IsNotEmpty()
  @IsDecimal()
  categoryId: number

  @IsNotEmpty()
  coverImageUrl: string

  @IsNotEmpty()
  title: string

  @IsNotEmpty()
  body: string

  @IsNotEmpty()
  @IsDecimal()
  authorId: number
}
