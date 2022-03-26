import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { PagableParams } from '~/shared-params/pagable.params'

@Injectable()
export class PagableParamsValidationPipe implements PipeTransform {
  transform(value: PagableParams) {
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
