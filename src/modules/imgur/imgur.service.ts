import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { firstValueFrom, map } from 'rxjs'
import { BusinessLogicException } from 'src/base-exceptions/business-logic.exception'
import { ImgurImageType, IMGUR_MAX_IMAGE_SIZE } from './imgur.constants'
import { ImgurErrors } from './imgur.errors'
import { ImgurOAuthInstance } from './imgur.oauth'
import { IImgurUploadImageResponseModel } from './models/i-imgur-upload-image-response.model'

export interface IImgurService {
  uploadImage(
    type: ImgurImageType,
    image: File,
  ): Promise<IImgurUploadImageResponseModel>
}

@Injectable()
export class ImgurService implements IImgurService {
  constructor(private readonly httpService: HttpService) {}

  async uploadImage(
    type: ImgurImageType,
    image: File,
  ): Promise<IImgurUploadImageResponseModel> {
    if (image.size > IMGUR_MAX_IMAGE_SIZE) {
      throw new BusinessLogicException(ImgurErrors.fileSizeExceed)
    }

    const formData = new FormData()
    formData.append('album', process.env[`IMGUR_ALBUM_HASH_${type}`])
    formData.append('image', image, image.name)

    const accessToken = await ImgurOAuthInstance.getAccessToken()

    return await firstValueFrom<IImgurUploadImageResponseModel>(
      this.httpService
        .post(process.env.IMGUR_IMAGE_UPLOAD_API_URL, formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        })
        .pipe(map((response) => response.data)),
    )
  }
}
