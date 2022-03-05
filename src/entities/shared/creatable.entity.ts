import { Column } from 'typeorm'

export abstract class Creatable {
  @Column({ type: 'timestamp', default: '(UTC_TIMESTAMP)' })
  createdAt: Date
}
