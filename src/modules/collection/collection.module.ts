import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Article } from '../article/article.entity'
import { PassportPermitModule } from '../passport-permit/passport-permit.module'
import { CollectionController } from './collection.controller'
import { Collection } from './collection.entity'
import { CollectionService } from './collection.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Article, Collection]),
    PassportPermitModule,
  ],
  exports: [CollectionService],
  providers: [CollectionService],
  controllers: [CollectionController],
})
export class CollectionModule {}
