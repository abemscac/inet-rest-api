import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { firstValueFrom, map } from 'rxjs'
import { getAppConfig } from 'src/app.config'
import { BusinessLogicException } from 'src/base-exceptions/business-logic.exception'
import { ImgurUtil } from 'src/utils/imgur.util'
import { IMGUR_MAX_IMAGE_SIZE } from './imgur.constants'
import { ImgurErrors } from './imgur.errors'
import {
  IImgurImage,
  IImgurUploadImageResponseModel,
} from './models/i-imgur-upload-image-response.model'

export interface IImgurService {
  uploadImage(
    image: Express.Multer.File,
    options?: IImgurServiceUploadImageOptions,
  ): Promise<IImgurImage>
  deleteImage(hash: string): Promise<void>
}

interface IImgurServiceUploadImageOptions {
  albumHash?: string
}

@Injectable()
export class ImgurService implements IImgurService {
  constructor(private readonly httpService: HttpService) {
    ImgurUtil.oauth.init()
  }

  async uploadImage(
    image: Express.Multer.File,
    options?: IImgurServiceUploadImageOptions,
  ): Promise<IImgurImage> {
    if (image.size > IMGUR_MAX_IMAGE_SIZE) {
      throw new BusinessLogicException(ImgurErrors.fileSizeExceed)
    }

    const formData = new FormData()
    formData.append('album', options?.albumHash)
    formData.append('image', new Blob([image.buffer]), image.originalname)

    const accessToken = await ImgurUtil.oauth.getAccessToken()
    const { uploadApiUrl } = getAppConfig().imgur.image

    const response = await firstValueFrom<IImgurUploadImageResponseModel>(
      this.httpService
        .post(uploadApiUrl, formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        })
        .pipe(map((response) => response.data)),
    )

    return response.data
  }

  async deleteImage(hash: string): Promise<void> {
    const { deleteApiUrl } = getAppConfig().imgur.image
    await firstValueFrom(this.httpService.delete(`${deleteApiUrl}/${hash}`))
  }
}
