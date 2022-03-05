import { Column } from 'typeorm'
import { Creatable } from './creatable.entity'

export abstract class Removable extends Creatable {
  @Column({ type: 'timestamp', name: 'removed_at', nullable: true })
  removedAt?: Date

  @Column({ type: 'bit', name: 'is_removed', default: 0 })
  isRemoved: boolean
}
