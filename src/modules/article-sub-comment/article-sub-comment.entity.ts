import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Removable } from '~/base-entities/removable.entity'
import { ArticleComment } from '../article-comment/article-comment.entity'
import { User } from '../user/user.entity'

@Entity({ name: 'article_sub_comment' })
export class ArticleSubComment extends Removable {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    name: 'parent_comment_id',
    type: 'int',
  })
  parentCommentId: number

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
  @ManyToOne(() => ArticleComment, (comment) => comment.subComments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_comment_id' })
  parentComment: ArticleComment

  @ManyToOne(() => User, (user) => user.articleComments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'author_id' })
  author: User
}
