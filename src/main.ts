import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { AppModule } from './app.module'
import { EntityNotFoundErrorFilter } from './filters/entity-not-found-error.filter'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  )
  app
    .useGlobalPipes(new ValidationPipe())
    .useGlobalFilters(new EntityNotFoundErrorFilter())
    .setGlobalPrefix('api')
  await app.listen(33823, '0.0.0.0')
}
bootstrap()
