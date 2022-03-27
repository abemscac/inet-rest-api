import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { SwaggerModule } from '@nestjs/swagger'
import { contentParser } from 'fastify-multer'
import { getAppConfig } from './app.config'
import { AppModule } from './app.module'
import { EntityNotFoundErrorFilter } from './filters/entity-not-found-error.filter'
import { createSwaggerDocumnt } from './swagger.document'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  )
  app.register(contentParser)
  app
    .useGlobalPipes(new ValidationPipe({ transform: true }))
    .useGlobalFilters(new EntityNotFoundErrorFilter())
    .setGlobalPrefix('api')
  SwaggerModule.setup('/docs', app, createSwaggerDocumnt(app))
  await app.listen(getAppConfig().apiPort, '0.0.0.0')
}
bootstrap()
