import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 50 })
  username: string

  @Column({ type: 'char', length: 60 })
  password: string

  @Column({ type: 'nvarchar', length: 50 })
  name: string

  @Column({ type: 'varchar', length: 2000 })
  avatar: string

  @Column({ type: 'timestamp', default: '(UTC_TIMESTAMP)' })
  createdAt: Date

  @Column({ type: 'timestamp' })
  lastModifiedAt?: Date

  @Column({ type: 'timestamp' })
  removedAt?: Date

  @Column({ type: 'bit', default: 0 })
  isRemoved: boolean
}
