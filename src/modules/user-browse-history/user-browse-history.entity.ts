import { Creatable } from 'src/base-entities/creatable.entity'
import { PagableParams } from 'src/shared-params/pagable.params'
import { IPagableViewModel } from 'src/shared-view-models/i-pagable.view-model'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Article } from '../article/article.entity'
import { User } from '../user/user.entity'
import { IUserBrowseHistoryViewModel } from './view-models/i-user-browse-history.view-model'

export interface IUserBrowseHistoryService {
  findByQuery(
    params: PagableParams,
  ): Promise<IPagableViewModel<IUserBrowseHistoryViewModel>>
  deleteById(id: number): Promise<void>
  deleteAll(): Promise<void>
}

@Entity({ name: 'user_browse_history' })
export class UserBrowseHistory extends Creatable {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'int',
    name: 'user_id',
  })
  userId: number

  @Column({
    type: 'int',
    name: 'article_id',
  })
  articleId: number

  // relations
  @ManyToOne(() => User, (user) => user.browseHistories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(() => Article, (article) => article.browseHistories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'article_id' })
  article: Article
}
