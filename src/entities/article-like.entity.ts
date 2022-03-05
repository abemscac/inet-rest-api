import { Entity, ManyToOne, PrimaryColumn } from 'typeorm'
import { Article } from './article.entity'
import { Creatable } from './shared/creatable.entity'
import { User } from './user.entity'

@Entity({ name: 'article_like' })
export class ArticleLike extends Creatable {
  @PrimaryColumn({ type: 'int', name: 'article_id' })
  articleId: number

  @PrimaryColumn({ type: 'int', name: 'user_id' })
  userId: number

  // relations
  @ManyToOne(() => Article, (article) => article.likes)
  article: Article

  @ManyToOne(() => User, (user) => user.articleLikes)
  user: User
}
