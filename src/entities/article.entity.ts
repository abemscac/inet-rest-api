import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { ArticleCategory } from './article-category.entity'
import { ArticleComment } from './article-comment.entity'
import { ArticleLike } from './article-like.entity'
import { Updatable } from './shared/updatable.entity'
import { UserBrowseHistory } from './user-browse-history.entity'
import { User } from './user.entity'

@Entity({ name: 'article' })
export class Article extends Updatable {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'tinyint', name: 'category_id', nullable: true })
  categoryId?: number

  @Column({ type: 'varchar', name: 'cover_image_url', length: 2000 })
  coverImageUrl: string

  @Column({ type: 'nvarchar', length: 100 })
  title: string

  @Column({ type: 'text' })
  body: string

  @Column({ type: 'int', default: 0 })
  views: number

  @Column({ type: 'int', name: 'author_id' })
  authorId: number

  // relations
  @ManyToOne(() => ArticleCategory, (category) => category.articles, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id' })
  category?: ArticleCategory

  @ManyToOne(() => User, (user) => user.articles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'author_id' })
  author: User

  @OneToMany(() => ArticleLike, (like) => like.article)
  likes: Array<ArticleLike>

  @OneToMany(() => ArticleComment, (comment) => comment.article)
  comments: Array<ArticleComment>

  @OneToMany(() => UserBrowseHistory, (browseHistory) => browseHistory.article)
  browseHistories: Array<UserBrowseHistory>
}
