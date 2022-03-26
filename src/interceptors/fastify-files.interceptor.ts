import {
  applyDecorators,
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Inject,
  mixin,
  NestInterceptor,
  Optional,
  Type,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { Request } from 'express'
import FastifyMulter from 'fastify-multer'
import { Multer, Options } from 'multer'
import { Observable } from 'rxjs'
import { FileUploadGuard } from '~/modules/imgur/file-upload.guard'
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.multer = (FastifyMulter as any)({ ...options, ...localOptions })
    }

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<unknown>> {
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

      if (Array.isArray(request.files)) {
        if (request.files.length < (localOptions?.minCount ?? 0)) {
          throw new BadRequestException(
            `At least ${localOptions?.minCount} files for '${fieldName}' is required, but only received ${request.files?.length}.`,
          )
        } else if (request.files.length) {
          validateAccept(localOptions?.accept)
          request.files?.forEach((file) =>
            validateExtensions(fieldName, file, localOptions?.accept),
          )
        }
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
) =>
  applyDecorators(
    UseGuards(FileUploadGuard),
    UseInterceptors(FastifyFiles(fieldName, localOptions)),
  )
