import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Creatable } from './shared/creatable.entity'

@Entity()
export class UserBrowseHistory extends Creatable {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'int' })
  userId: number

  @Column({ type: 'int' })
  articleId: number
}
