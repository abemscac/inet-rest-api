import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class ArticleCategory {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 20 })
  code: string

  @Column({ type: 'varchar', length: 20 })
  icon: string

  @Column({ type: 'smallint' })
  index: number

  @Column({ type: 'timestamp', default: '(UTC_TIMESTAMP)' })
  createdAt: Date

  @Column({ type: 'timestamp' })
  removedAt?: Date

  @Column({ type: 'bit', default: 0 })
  isRemoved: boolean
}
