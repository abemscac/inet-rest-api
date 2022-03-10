import { Creatable } from 'src/base-entities/creatable.entity'
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { Article } from '../article/article.entity'
import { User } from '../user/user.entity'

@Entity({ name: 'article_like' })
export class ArticleLike extends Creatable {
  @PrimaryColumn({
    name: 'article_id',
    type: 'int',
  })
  articleId: number

  @PrimaryColumn({
    name: 'user_id',
    type: 'int',
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
