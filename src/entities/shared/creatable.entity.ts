import { Column } from 'typeorm'

export abstract class Creatable {
  @Column({ type: 'timestamp', name: 'created_at', default: '(UTC_TIMESTAMP)' })
  createdAt: Date
}
