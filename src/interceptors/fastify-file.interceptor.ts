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

interface IFastifyFileInterceptorOptions extends Options {
  required?: boolean
}

const FastifyFile = (
  fieldName: string,
  localOptions?: IFastifyFileInterceptorOptions,
): Type<NestInterceptor> => {
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
        this.multer.single(fieldName)(
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

      if (localOptions?.required && !request.file) {
        throw new BadRequestException(`File '${fieldName}' is required.`)
      }

      request.body[fieldName] = request.file
      return next.handle()
    }
  }

  return mixin(MixinInterceptor) as Type<NestInterceptor>
}

export const FastifyFileInterceptor = (
  fieldName: string,
  localOptions?: IFastifyFileInterceptorOptions,
) => UseInterceptors(FastifyFile(fieldName, localOptions))
