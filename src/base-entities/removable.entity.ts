import { TinyIntBooleanTransformer } from 'src/transformers/tinyint-boolean.transformer'
import { Column } from 'typeorm'
import { Creatable } from './creatable.entity'

export abstract class Removable extends Creatable {
  @Column({
    name: 'removed_at',
    type: 'timestamp',
    nullable: true,
  })
  removedAt?: Date

  @Column({
    name: 'is_removed',
    type: 'tinyint',
    default: () => 0,
    transformer: new TinyIntBooleanTransformer(),
  })
  isRemoved: boolean
}
