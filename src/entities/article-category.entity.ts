import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { Removable } from './shared/removable.entity'

@Entity()
export class ArticleCategory extends Removable {
  @PrimaryGeneratedColumn('increment', { type: 'tinyint' })
  id: number

  @Column({ type: 'varchar', length: 20 })
  code: string

  @Column({ type: 'varchar', length: 20 })
  icon: string

  @Column({ type: 'tinyint' })
  index: number
}
