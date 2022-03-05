import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Article } from '../article/article.entity'
import { Removable } from '../base-entities/removable.entity'
import { User } from '../user/user.entity'

@Entity({ name: 'article_comment' })
export class ArticleComment extends Removable {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    name: 'article_id',
    type: 'int',
  })
  articleId: number

  @Column({
    name: 'author_id',
    type: 'int',
  })
  authorId: number

  @Column({
    type: 'nvarchar',
    length: 500,
  })
  body: string

  // relations
  @ManyToOne(() => Article, (article) => article.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'article_id' })
  article: Article

  @ManyToOne(() => User, (user) => user.articleComments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'author_id' })
  author: User
}
