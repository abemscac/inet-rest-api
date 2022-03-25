import { HttpModule } from '@nestjs/axios'
import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { ImgurQueueName } from './imgur.queue'
import { ImgurQueueConsumer } from './imgur.queue.consumer'
import { ImgurService } from './imgur.service'

@Module({
  imports: [
    HttpModule,
    BullModule.registerQueue({
      name: ImgurQueueName,
    }),
  ],
  providers: [ImgurService, ImgurQueueConsumer],
  exports: [ImgurService],
})
export class ImgurModule {}
