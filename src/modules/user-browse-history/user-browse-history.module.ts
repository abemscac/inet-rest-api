import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Article } from '../article/article.entity'
import { PassportPermitModule } from '../passport-permit/passport-permit.module'
import { UserBrowseHistoryController } from './user-browse-history.controller'
import { UserBrowseHistory } from './user-browse-history.entity'
import { UserBrowseHistoryService } from './user-browse-history.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Article, UserBrowseHistory]),
    PassportPermitModule,
  ],
  exports: [UserBrowseHistoryService],
  providers: [UserBrowseHistoryService],
  controllers: [UserBrowseHistoryController],
})
export class UserBrowseHistoryModule {}
