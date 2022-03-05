import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Article } from './article.entity'
import { Creatable } from './shared/creatable.entity'
import { User } from './user.entity'

@Entity({ name: 'user_browse_history' })
export class UserBrowseHistory extends Creatable {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'int', name: 'user_id' })
  userId: number

  @Column({ type: 'int', name: 'article_id' })
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
