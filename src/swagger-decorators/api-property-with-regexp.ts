import {
  ApiProperty,
  ApiPropertyOptional,
  ApiPropertyOptions,
} from '@nestjs/swagger'

interface IApiPropertyWithRegExpOptions {
  extraDescription?: string
  example?: string
  /**
   * @default false
   */
  optional?: boolean
}

export const ApiPropertyWithRegexp = (
  regexp: RegExp,
  options?: IApiPropertyWithRegExpOptions,
) => {
  let description = `RegExp: ${regexp.source}`
  if (options?.extraDescription) {
    description += `<br>${options.extraDescription}`
  }

  const propOptions: ApiPropertyOptions = {
    description,
    example: options?.example,
  }

  return options?.optional
    ? ApiPropertyOptional(propOptions)
    : ApiProperty(propOptions)
}
