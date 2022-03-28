import { ApiProperty } from '@nestjs/swagger'

export const ApiPropertyImage = (description?: string) => {
  const fullDescription =
    'A file with extension of either .jpg, .jpeg, or .png' +
    (description ? `.<br>${description}` : '')
  return ApiProperty({
    type: 'string',
    format: 'binary',
    description: fullDescription,
  })
}
