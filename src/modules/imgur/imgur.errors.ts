import { IBusinessLogicError } from '~/base-exceptions/business-logic.exception'
import { IMGUR_MAX_IMAGE_SIZE } from './imgur.constants'

export enum ImgurErrorCode {
  FileSizeExceed = 'GENERIC_FILE_SIZE_EXCEED',
}

export const ImgurErrors: Record<
  keyof typeof ImgurErrorCode,
  IBusinessLogicError
> = {
  FileSizeExceed: {
    code: ImgurErrorCode.FileSizeExceed,
    message: `The maximum image size is ${IMGUR_MAX_IMAGE_SIZE} bytes.`,
  },
}
