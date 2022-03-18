import { Type } from 'class-transformer'
import { IsInt, IsNotEmpty } from 'class-validator'

export class UserBrowseHistoryCreateForm {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  articleId: number
}
