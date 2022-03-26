import { applyDecorators, UseGuards } from '@nestjs/common'
import { FileUploadGuard } from '~/modules/imgur/file-upload.guard'
import { FastifyFileInterceptor } from './fastify-file.interceptor'

interface IFastifyImageFileInterceptorOptions {
  required: boolean
}

export const FastifyImageFileInterceptor = (
  fieldName: string,
  options: IFastifyImageFileInterceptorOptions,
) =>
  applyDecorators(
    UseGuards(FileUploadGuard),
    FastifyFileInterceptor(fieldName, {
      ...options,
      accept: ['.jpg', '.jpeg', '.png'],
    }),
  )
