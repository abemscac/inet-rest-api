import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Inject,
  mixin,
  NestInterceptor,
  Optional,
  Type,
  UseInterceptors,
} from '@nestjs/common'
import { Request } from 'express'
import FastifyMulter from 'fastify-multer'
import { Multer, Options } from 'multer'
import { Observable } from 'rxjs'
import { validateAccept, validateExtensions } from './fastify-file.interceptor'

interface IFastifyFilesInterceptorOptions extends Options {
  /**
   * File extensions array with ".", for example, ['.jpg', '.jpeg', '.png']
   */
  accept?: Array<string>
  minCount?: number
  maxCount?: number
}

function FastifyFiles(
  fieldName: string,
  localOptions?: IFastifyFilesInterceptorOptions,
): Type<NestInterceptor> {
  class MixinInterceptor implements NestInterceptor {
    protected multer: Multer

    constructor(
      @Optional()
      @Inject('MULTER_MODULE_OPTIONS')
      options: Multer,
    ) {
      this.multer = (FastifyMulter as any)({ ...options, ...localOptions })
    }

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      const httpContext = context.switchToHttp()
      const request = httpContext.getRequest() as Request

      await new Promise<void>((resolve, reject) =>
        this.multer.array(fieldName, localOptions?.maxCount)(
          request,
          httpContext.getResponse(),
          (error: unknown) => {
            if (error) {
              return reject(error)
            }
            return resolve()
          },
        ),
      )

      if (request.files?.length < localOptions?.minCount) {
        throw new BadRequestException(
          `At least ${localOptions?.minCount} files for '${fieldName}' is required, but only received ${request.files?.length}.`,
        )
      } else if (Array.isArray(request.files) && request.files.length) {
        validateAccept(localOptions?.accept)
        request.files?.forEach((file) =>
          validateExtensions(fieldName, file, localOptions?.accept),
        )
      }

      request.body[fieldName] = request.files

      return next.handle()
    }
  }

  return mixin(MixinInterceptor) as Type<NestInterceptor>
}

export const FastifyFilesInterceptor = (
  fieldName: string,
  localOptions?: IFastifyFilesInterceptorOptions,
) => UseInterceptors(FastifyFiles(fieldName, localOptions))
