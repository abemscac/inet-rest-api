import { Column } from 'typeorm'
import { Creatable } from './creatable.entity'

export abstract class Removable extends Creatable {
  @Column({ type: 'timestamp', nullable: true })
  removedAt?: Date

  @Column({ type: 'bit', default: 0 })
  isRemoved: boolean
}
