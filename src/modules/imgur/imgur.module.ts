import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ImgurService } from './imgur.service'

@Module({
  imports: [HttpModule],
  exports: [ImgurService],
  providers: [ImgurService],
})
export class ImgurModule {}
