import { Column } from 'typeorm'
import { Removable } from './removable.entity'

export abstract class Updatable extends Removable {
  @Column({ type: 'timestamp', nullable: true })
  lastModifiedAt?: Date
}
