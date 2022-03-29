import { ApiProperty } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { IsInt, IsNotEmpty } from 'class-validator'
import { MockArticleCommentViewModels } from '../article-comment.mocks'

export class ArticleCommentCreateForm {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  articleId: number

  @ApiProperty({ example: MockArticleCommentViewModels[0].body })
  @IsNotEmpty()
  @Transform((params) => params.value?.trim())
  body: string
}
