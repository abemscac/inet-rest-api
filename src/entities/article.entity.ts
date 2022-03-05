import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { Updatable } from './shared/updatable.entity'

@Entity()
export class Article extends Updatable {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'tinyint' })
  categoryId: number

  @Column({ type: 'varchar', length: 2000 })
  coverImageUrl: string

  @Column({ type: 'nvarchar', length: 100 })
  title: string

  @Column({ type: 'text' })
  body: string

  @Column({ type: 'int', default: 0 })
  views: number

  @Column({ type: 'int' })
  authorId: number
}
