import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ArticleCategory } from '../article-category/article-category.entity'
import { ImgurModule } from '../imgur/imgur.module'
import { PassportPermitModule } from '../passport-permit/passport-permit.module'
import { UserBrowseHistoryModule } from '../user-browse-history/user-browse-history.module'
import { ArticleController } from './article.controller'
import { Article } from './article.entity'
import { ArticleQueueName } from './article.queue'
import { ArticleQueueConsumer } from './article.queue.consumer'
import { ArticleService } from './article.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Article]),
    TypeOrmModule.forFeature([ArticleCategory]),
    BullModule.registerQueue({
      name: ArticleQueueName,
    }),
    PassportPermitModule,
    UserBrowseHistoryModule,
    ImgurModule,
  ],
  exports: [ArticleService],
  providers: [ArticleService, ArticleQueueConsumer],
  controllers: [ArticleController],
})
export class ArticleModule {}
