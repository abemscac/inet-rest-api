import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, IsNotEmpty } from 'class-validator'

export class CreateArticleLikeForm {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  articleId: number
}
