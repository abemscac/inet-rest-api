import { Transform } from 'class-transformer'
import { IsNotEmpty, Length } from 'class-validator'

export class UserCreateForm {
  @IsNotEmpty()
  @Length(4, 50)
  @Transform((params) => params.value?.trim())
  username: string

  @IsNotEmpty()
  @Length(4, 60)
  @Transform((params) => params.value?.trim())
  password: string

  @Length(0, 50)
  @Transform((params) => params.value?.trim())
  name?: string | null

  /**
   * This field will be assigned in FastifyFileInterceptor
   */
  avatar?: Express.Multer.File | null
}
