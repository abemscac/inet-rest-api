import { FastifyFileInterceptor } from './fastify-file.interceptor'

interface IFastifyImageFileInterceptorOptions {
  required: boolean
}

export const FastifyImageFileInterceptor = (
  fieldName: string,
  options?: IFastifyImageFileInterceptorOptions,
) =>
  FastifyFileInterceptor(fieldName, {
    ...options,
    accept: ['.jpg', '.jpeg', '.png'],
  })
