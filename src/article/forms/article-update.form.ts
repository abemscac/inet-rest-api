import { IsDecimal, IsNotEmpty } from 'class-validator'

export class ArticleUpdateForm {
  @IsNotEmpty()
  @IsDecimal()
  categoryId: number

  @IsNotEmpty()
  coverImageUrl: string

  @IsNotEmpty()
  title: string

  @IsNotEmpty()
  body: string
}
