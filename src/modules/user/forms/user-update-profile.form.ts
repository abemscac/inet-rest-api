import { Transform } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

export class UserUpdateProfileForm {
  @IsNotEmpty()
  @Transform((params) => params.value?.trim())
  name: string | null

  /**
   * This field will be assigned in FastifyFileInterceptor
   */
  avatar?: Express.Multer.File
}
