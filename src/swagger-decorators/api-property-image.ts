import { ApiProperty } from '@nestjs/swagger'

export const ApiPropertyImage = () =>
  ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'A file with extension of either .jpg, .jpeg, or .png',
  })
