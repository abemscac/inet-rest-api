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

@Entity({ name: 'article_like' })
@Unique(['articleId', 'userId'])
export class ArticleLike extends Creatable {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'int',
    name: 'article_id',
  })
  articleId: number

  @Column({
    type: 'int',
    name: 'user_id',
  })
  userId: number

  // relations
  @ManyToOne(() => Article, (article) => article.likes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'article_id' })
  article: Article

  @ManyToOne(() => User, (user) => user.articleLikes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User
}
