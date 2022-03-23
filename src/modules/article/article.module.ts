import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ImgurModule } from '../imgur/imgur.module'
import { PassportPermitModule } from '../passport-permit/passport-permit.module'
import { UserBrowseHistoryModule } from '../user-browse-history/user-browse-history.module'
import { ArticleController } from './article.controller'
import { Article } from './article.entity'
import { ArticleService } from './article.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Article]),
    PassportPermitModule,
    UserBrowseHistoryModule,
    ImgurModule,
  ],
  exports: [ArticleService],
  providers: [ArticleService],
  controllers: [ArticleController],
})
export class ArticleModule {}
