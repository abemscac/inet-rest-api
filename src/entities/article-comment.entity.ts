import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Article } from './article.entity'
import { Removable } from './shared/removable.entity'
import { User } from './user.entity'

@Entity({ name: 'article_comment' })
export class ArticleComment extends Removable {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'int', name: 'article_id' })
  articleId: number

  @Column({ type: 'int', name: 'author_id' })
  authorId: number

  @Column({ type: 'nvarchar', length: 500 })
  body: string

  // relations
  @ManyToOne(() => Article, (article) => article.comments)
  article: Article

  @ManyToOne(() => User, (user) => user.articleComments)
  author: User
}
