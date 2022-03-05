import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ArticleComment } from './article-comment.entity'
import { ArticleLike } from './article-like.entity'
import { Article } from './article.entity'
import { Updatable } from './shared/updatable.entity'
import { UserBrowseHistory } from './user-browse-history.entity'

@Entity({ name: 'user' })
export class User extends Updatable {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 50 })
  username: string

  @Column({ type: 'char', length: 60 })
  password: string

  @Column({ type: 'nvarchar', length: 50, nullable: true })
  name?: string

  @Column({ type: 'varchar', length: 2000, name: 'avatar_url', nullable: true })
  avatarUrl?: string

  // relations
  @OneToMany(() => Article, (article) => article.author)
  articles: Array<Article>

  @OneToMany(() => ArticleLike, (like) => like.user)
  articleLikes: Array<ArticleLike>

  @OneToMany(() => ArticleComment, (comment) => comment.author)
  articleComments: Array<ArticleComment>

  @OneToMany(() => UserBrowseHistory, (browseHistory) => browseHistory.user)
  browseHistories: Array<UserBrowseHistory>
}
