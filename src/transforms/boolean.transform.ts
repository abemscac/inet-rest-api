import { Transform } from 'class-transformer'

export const BooleanTransform = () =>
  Transform((params) => params.value === '1')
