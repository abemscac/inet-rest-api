import { ApiProperty } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { IsInt, IsNotEmpty } from 'class-validator'
import { MockArticleCommentViewModels } from '~/modules/article-comment/article-comment.mocks'

export class ArticleSubCommentCreateForm {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  parentCommentId: number

  @ApiProperty({ example: MockArticleCommentViewModels[0].body })
  @IsNotEmpty()
  @Transform((params) => params.value?.trim())
  body: string
}
