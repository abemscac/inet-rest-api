import {
  applyDecorators,
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Inject,
  InternalServerErrorException,
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
import { FileUploadGuard } from 'src/modules/imgur/file-upload.guard'

interface IFastifyFileInterceptorOptions extends Options {
  /**
   * File extensions array with ".", for example, ['.jpg', '.jpeg', '.png']
   */
  accept?: Array<string>
  required: boolean
}

export const validateAccept = (accept?: Array<string>) => {
  if (!accept?.length) return
  // validate accept
  accept.forEach((ext) => {
    if (!ext.startsWith('.')) {
      throw new InternalServerErrorException(
        `The item in accept must starts with "."`,
      )
    }
  })
}

export const validateExtensions = (
  fieldName: string,
  file?: Express.Multer.File,
  accept?: Array<string>,
): void => {
  if (!file || !accept?.length) return
  const accepted = accept.some((ext) => file.originalname.endsWith(ext))
  if (!accepted) {
    throw new BadRequestException(
      `File ${fieldName} must be one of ${accept.join(' ')} for this request.`,
    )
  }
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
      validateAccept(localOptions?.accept)
      validateExtensions(fieldName, request.file, localOptions?.accept)

      request.body[fieldName] = request.file
      return next.handle()
    }
  }

  return mixin(MixinInterceptor) as Type<NestInterceptor>
}

export const FastifyFileInterceptor = (
  fieldName: string,
  localOptions?: IFastifyFileInterceptorOptions,
) =>
  applyDecorators(
    UseGuards(FileUploadGuard),
    UseInterceptors(FastifyFile(fieldName, localOptions)),
  )
