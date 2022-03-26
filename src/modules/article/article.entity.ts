import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Updatable } from '~/base-entities/updatable.entity'
import { ArticleCategory } from '../article-category/article-category.entity'
import { ArticleComment } from '../article-comment/article-comment.entity'
import { ArticleLike } from '../article-like/article-like.entity'
import { UserBrowseHistory } from '../user-browse-history/user-browse-history.entity'
import { User } from '../user/user.entity'

@Entity({ name: 'article' })
export class Article extends Updatable {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    name: 'category_id',
    type: 'smallint',
  })
  categoryId: number

  @Column({
    name: 'cover_image_hash',
    type: 'varchar',
    length: 2000,
  })
  coverImageHash: string

  @Column({
    name: 'cover_image_ext',
    type: 'varchar',
    length: 5,
  })
  coverImageExt: string

  @Column({
    type: 'nvarchar',
    length: 100,
  })
  title: string

  @Column({
    type: 'text',
  })
  body: string

  @Column({
    type: 'int',
    default: () => 0,
  })
  views: number

  @Column({
    name: 'author_id',
    type: 'int',
  })
  authorId: number

  // relations
  @ManyToOne(() => ArticleCategory, (category) => category.articles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: ArticleCategory

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
