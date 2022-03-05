import { Column } from 'typeorm'

export abstract class Creatable {
  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => '(UTC_TIMESTAMP)',
  })
  createdAt: Date
}
