import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { Updatable } from './shared/updatable.entity'

@Entity()
export class User extends Updatable {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 50 })
  username: string

  @Column({ type: 'char', length: 60 })
  password: string

  @Column({ type: 'nvarchar', length: 50, nullable: true })
  name?: string

  @Column({ type: 'varchar', length: 2000, nullable: true })
  avatarUrl?: string
}
