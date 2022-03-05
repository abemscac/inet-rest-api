import { ValueTransformer } from 'typeorm'

export class TinyIntBooleanTransformer implements ValueTransformer {
  from(value: number | null): boolean | null {
    return value === null ? null : value === 1
  }

  to(value: boolean | null): number | null {
    return value === null ? null : Number(value)
  }
}
