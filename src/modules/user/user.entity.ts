import { Updatable } from 'src/base-entities/updatable.entity'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ArticleComment } from '../article-comment/article-comment.entity'
import { ArticleLike } from '../article-like/article-like.entity'
import { Article } from '../article/article.entity'
import { UserBrowseHistory } from '../user-browse-history/user-browse-history.entity'

@Entity({ name: 'user' })
export class User extends Updatable {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
  })
  username: string

  @Column({
    type: 'char',
    length: 60,
  })
  password: string

  @Column({
    type: 'nvarchar',
    length: 50,
    nullable: true,
  })
  name?: string

  @Column({
    type: 'varchar',
    length: 2000,
    name: 'avatar_image_hash',
    nullable: true,
  })
  avatarImageHash?: string

  @Column({
    type: 'char',
    length: 60,
    name: 'refresh_token_hash',
    nullable: true,
  })
  refreshTokenHash?: string

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
