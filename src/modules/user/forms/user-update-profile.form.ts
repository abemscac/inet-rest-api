import { Transform } from 'class-transformer'

export class UserUpdateProfileForm {
  @Transform((params) => params.value?.trim())
  name: string | null

  /**
   * This field will be assigned in FastifyFileInterceptor
   */
  avatar?: Express.Multer.File
}
