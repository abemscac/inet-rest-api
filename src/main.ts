import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { AppModule } from './app.module'
import { GetNotFoundInterceptor } from './interceptors/get-not-found.interceptor'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  )
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalInterceptors(new GetNotFoundInterceptor())
  app.setGlobalPrefix('api')
  await app.listen(33823, '0.0.0.0')
}
bootstrap()
