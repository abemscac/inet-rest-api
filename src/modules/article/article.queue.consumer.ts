import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { ImgurService } from '../imgur/imgur.service'
import {
  ArticleQueueEventType,
  ArticleQueueName,
  IArticleQueuePayload,
} from './article.queue'

export interface IArticleQueueProcessor {
  removeCoverImage(job: Job<IArticleQueuePayload>): Promise<void>
}

@Processor(ArticleQueueName)
export class ArticleQueueConsumer implements IArticleQueueProcessor {
  constructor(private readonly imgurService: ImgurService) {}

  @Process(ArticleQueueEventType.RemoveCoverImage)
  async removeCoverImage(job: Job<IArticleQueuePayload>): Promise<void> {
    const { coverImageHash } = job.data
    await this.imgurService.deleteImage(coverImageHash)
    await job.progress(100)
  }
}
