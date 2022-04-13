import { ApiPropertyImage } from '~/swagger-decorators/api-property-image'

export class UpdateAvatarForm {
  /**
   * This field will be assigned in FastifyFileInterceptor
   */
  @ApiPropertyImage()
  avatar: Express.Multer.File
}
