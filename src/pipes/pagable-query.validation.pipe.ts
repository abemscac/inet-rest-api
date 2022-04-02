import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { PagableQuery } from '~/shared-queries/pagable.query'

@Injectable()
export class PagableQueryValidationPipe implements PipeTransform {
  transform(value: PagableQuery) {
    const { page, limit, FLAG_UNLIMITED } = value
    if (limit === undefined && !FLAG_UNLIMITED) {
      throw new BadRequestException(
        `Query param 'FLAG_UNLIMITED' is required when 'limit' is not provided in a pagable request.`,
      )
    } else if (limit && page === undefined) {
      throw new BadRequestException(
        `Query param 'page' is required in a pagable request`,
      )
    }
    return value
  }
}
