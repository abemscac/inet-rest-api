import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'
import { Creatable } from '~/base-entities/creatable.entity'
import { Article } from '../article/article.entity'
import { User } from '../user/user.entity'

@Entity({ name: 'collection' })
@Unique(['userId', 'articleId'])
export class Collection extends Creatable {
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
  @ManyToOne(() => User, (user) => user.collections, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(() => Article, (article) => article.collections, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'article_id' })
  article: Article
}
