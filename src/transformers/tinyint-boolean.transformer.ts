import { ValueTransformer } from 'typeorm'

interface ITinyIntBooleanTransformerOptions {
  /**
   * @default false
   */
  nullable: boolean
}

export class TinyIntBooleanTransformer implements ValueTransformer {
  constructor(private readonly options?: ITinyIntBooleanTransformerOptions) {}

  from(dbValue: number | null): boolean | null {
    return dbValue === null ? null : dbValue === 1
  }

  to(value?: boolean | null): number | null {
    const isEmpty = value === null || value === undefined
    return isEmpty && this.options?.nullable ? null : Number(value ?? 0)
  }
}
