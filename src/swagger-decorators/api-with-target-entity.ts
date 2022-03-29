import { ApiNotFoundResponse } from '@nestjs/swagger'

/**
 * @param entity default: 'entity'
 */
export const ApiWithTargetEntity = (entity?: string) =>
  ApiNotFoundResponse({
    description: `Target ${entity || 'entity'} does not exist.`,
  })
