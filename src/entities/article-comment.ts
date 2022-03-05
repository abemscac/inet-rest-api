import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { Removable } from './shared/removable.entity'

@Entity()
export class ArticleComment extends Removable {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'int' })
  articleId: number

  @Column({ type: 'int' })
  authorId: number

  @Column({ type: 'nvarchar', length: 500 })
  body: string
}
