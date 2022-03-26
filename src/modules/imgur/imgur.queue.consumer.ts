import { HttpService } from '@nestjs/axios'
import { Process, Processor } from '@nestjs/bull'
import { InternalServerErrorException } from '@nestjs/common'
import { Job } from 'bull'
import { firstValueFrom } from 'rxjs'
import { getAppConfig } from '~/app.config'
import { ImgurUtil } from '~/utils/imgur.util'
import {
  IImgurQueuePayload,
  ImgurQueueEvent,
  ImgurQueueName,
} from './imgur.queue'

export interface IImgurQueueProcessor {
  removeCoverImage(job: Job<IImgurQueuePayload>): Promise<void>
}

@Processor(ImgurQueueName)
export class ImgurQueueConsumer implements IImgurQueueProcessor {
  constructor(private httpService: HttpService) {}

  @Process(ImgurQueueEvent.RemoveImage)
  async removeCoverImage(job: Job<IImgurQueuePayload>): Promise<void> {
    const { hash } = job.data
    if (!hash) {
      throw new InternalServerErrorException(
        'Cannot run job on empty imageHash',
      )
    }

    const { deleteApiUrl } = getAppConfig().imgur.image
    const accessToken = await ImgurUtil.oauth.getAccessToken()
    await firstValueFrom(
      this.httpService.delete(`${deleteApiUrl}/${hash}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    )
    await job.progress(100)
  }
}
