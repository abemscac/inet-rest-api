import { HttpService } from '@nestjs/axios'
import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bull'
import * as FormData from 'form-data'
import { firstValueFrom, map } from 'rxjs'
import { getAppConfig } from 'src/app.config'
import { BusinessLogicException } from 'src/base-exceptions/business-logic.exception'
import { ImgurUtil } from 'src/utils/imgur.util'
import { ImgurAlbum, IMGUR_MAX_IMAGE_SIZE } from './imgur.constants'
import { ImgurErrors } from './imgur.errors'
import {
  IImgurQueuePayload,
  ImgurQueueEvent,
  ImgurQueueName,
} from './imgur.queue'
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
  album?: ImgurAlbum
}

@Injectable()
export class ImgurService implements IImgurService {
  constructor(
    private readonly httpService: HttpService,
    @InjectQueue(ImgurQueueName)
    private readonly imgurQueue: Queue<IImgurQueuePayload>,
  ) {
    ImgurUtil.oauth.init()
  }

  async uploadImage(
    image: Express.Multer.File,
    options?: IImgurServiceUploadImageOptions,
  ): Promise<IImgurImage> {
    if (image.size > IMGUR_MAX_IMAGE_SIZE) {
      throw new BusinessLogicException(ImgurErrors.FileSizeExceed)
    }

    const { uploadApiUrl, albumHashRecord } = getAppConfig().imgur.image

    const formData = new FormData()
    if (options?.album) {
      formData.append('album', albumHashRecord[options.album])
    }
    formData.append('image', Buffer.from(image.buffer), image.originalname)

    const accessToken = await ImgurUtil.oauth.getAccessToken()
    const response = await firstValueFrom<IImgurUploadImageResponseModel>(
      this.httpService
        .post(uploadApiUrl, formData, {
          headers: {
            ...formData.getHeaders(),
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .pipe(map((response) => response.data)),
    )

    return response.data
  }

  async deleteImage(hash: string): Promise<void> {
    await this.imgurQueue.add(ImgurQueueEvent.RemoveImage, {
      hash,
    })
  }
}
