import { Entity, PrimaryColumn } from 'typeorm'
import { Creatable } from './shared/creatable.entity'

@Entity()
export class ArticleLike extends Creatable {
  @PrimaryColumn({ type: 'int' })
  articleId: number

  @PrimaryColumn({ type: 'int' })
  userId: number
}
