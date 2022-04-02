import { Type } from 'class-transformer'
import { IsInt, IsNotEmpty } from 'class-validator'

export class CreateUserBrowseHistoryForm {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  articleId: number
}
