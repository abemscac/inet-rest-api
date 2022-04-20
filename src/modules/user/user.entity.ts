import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Updatable } from '~/base-entities/updatable.entity'
import { ArticleComment } from '../article-comment/article-comment.entity'
import { ArticleLike } from '../article-like/article-like.entity'
import { Article } from '../article/article.entity'
import { Collection } from '../collection/collection.entity'
import { UserBrowseHistory } from '../user-browse-history/user-browse-history.entity'

@Entity({ name: 'user' })
export class User extends Updatable {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'varchar',
    length: 30,
    unique: true,
  })
  username: string

  @Column({
    type: 'char',
    length: 60,
    name: 'hashed_password',
  })
  hashedPassword: string

  @Column({
    type: 'nvarchar',
    length: 50,
    nullable: true,
  })
  name: string | null

  @Column({
    type: 'varchar',
    length: 20,
    name: 'avatar_image_hash',
    nullable: true,
  })
  avatarImageHash: string | null

  @Column({
    type: 'varchar',
    length: 5,
    name: 'avatar_image_ext',
    nullable: true,
  })
  avatarImageExt: string | null

  @Column({
    type: 'char',
    length: 60,
    name: 'hashed_refresh_token',
    nullable: true,
  })
  hashedRefreshToken: string | null

  // relations
  @OneToMany(() => Article, (article) => article.author)
  articles: Array<Article>

  @OneToMany(() => ArticleLike, (like) => like.user)
  articleLikes: Array<ArticleLike>

  @OneToMany(() => ArticleComment, (comment) => comment.author)
  articleComments: Array<ArticleComment>

  @OneToMany(() => UserBrowseHistory, (browseHistory) => browseHistory.user)
  browseHistories: Array<UserBrowseHistory>

  @OneToMany(() => Collection, (collection) => collection.user)
  collections: Array<Collection>
}
