import { Column } from 'typeorm'
import { Removable } from './removable.entity'

export abstract class Updatable extends Removable {
  @Column({
    name: 'last_modified_at',
    type: 'timestamp',
    nullable: true,
  })
  lastModifiedAt?: Date
}
