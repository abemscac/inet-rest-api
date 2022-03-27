import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { AppService } from './app.service'
import { ApiOkExample } from './swagger-decorators/api-ok-example'

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Show the metadata of API' })
  @ApiOkExample('INET-REST-API 1.0.0')
  @Get()
  getVersion(): string {
    return this.appService.getVersion()
  }
}
