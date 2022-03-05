import { Column } from 'typeorm'
import { Removable } from './removable.entity'

export abstract class Updatable extends Removable {
  @Column({ type: 'timestamp', name: 'last_modified_at', nullable: true })
  lastModifiedAt?: Date
}
