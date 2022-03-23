import {
  CallHandler,
  ExecutionContext,
  Inject,
  mixin,
  NestInterceptor,
  Optional,
  Type,
  UseInterceptors,
} from '@nestjs/common'
import FastifyMulter from 'fastify-multer'
import { Multer, Options } from 'multer'
import { Observable } from 'rxjs'

function FastifyFiles(
  fieldName: string,
  maxCount?: number,
  localOptions?: Options,
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

      await new Promise<void>((resolve, reject) =>
        this.multer.array(fieldName, maxCount)(
          httpContext.getRequest(),
          httpContext.getResponse(),
          (error: unknown) => {
            if (error) {
              return reject(error)
            }
            return resolve()
          },
        ),
      )

      return next.handle()
    }
  }

  return mixin(MixinInterceptor) as Type<NestInterceptor>
}

export const FastifyFilesInterceptor = (
  fieldName: string,
  maxCount?: number,
  localOptions?: Options,
) => UseInterceptors(FastifyFiles(fieldName, maxCount, localOptions))
