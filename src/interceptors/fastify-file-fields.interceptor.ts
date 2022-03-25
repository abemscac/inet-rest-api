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
import { Field, Multer, Options } from 'multer'
import { Observable } from 'rxjs'
import { FileUploadGuard } from 'src/modules/imgur/file-upload.guard'

interface IFastifyFileFieldsInterceptorField extends Field {
  minCount?: number
}

function FastifyFileFields(
  fields: Array<IFastifyFileFieldsInterceptorField>,
  localOptions?: Options,
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
        this.multer.fields(fields)(
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

      for (const key in fields) {
        const record = request.files as
          | Record<string, Array<Express.Multer.File>>
          | undefined
        const files = record?.[key]
        const fileCount = files?.length ?? 0
        const { minCount = 0 } = fields[key]
        if (fileCount < minCount) {
          throw new BadRequestException(
            `At least ${minCount} files for '${key}' is required, but only received ${fileCount}.`,
          )
        }
        request.body[key] = files
      }

      return next.handle()
    }
  }

  return mixin(MixinInterceptor) as Type<NestInterceptor>
}

export const FastifyFileFieldsInterceptor = (
  fields: Array<IFastifyFileFieldsInterceptorField>,
  localOptions?: Options,
) =>
  applyDecorators(
    UseGuards(FileUploadGuard),
    UseInterceptors(FastifyFileFields(fields, localOptions)),
  )
