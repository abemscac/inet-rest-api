import { IMGUR_MAX_IMAGE_SIZE } from './imgur.constants'

export enum ImgurErrorCodes {
  FileSizeExceed = 'FILE_SIZE_EXCEED',
}

export const ImgurErrors = {
  fileSizeExceed: {
    code: ImgurErrorCodes.FileSizeExceed,
    message: `File size of uploaded image must not exceed ${IMGUR_MAX_IMAGE_SIZE} bytes.`,
  },
}
