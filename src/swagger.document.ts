import { NestFastifyApplication } from '@nestjs/platform-fastify'
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger'

export const createSwaggerDocumnt = (
  app: NestFastifyApplication,
): OpenAPIObject => {
  const { npm_package_name, npm_package_version } = process.env
  const config = new DocumentBuilder()
    .setTitle(npm_package_name?.toUpperCase() ?? '')
    .setVersion(npm_package_version ?? '0.0.0')
    .build()
  return SwaggerModule.createDocument(app, config)
}
