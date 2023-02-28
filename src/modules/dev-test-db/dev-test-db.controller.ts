import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ProcessEnvironment } from '../../utils/env.util'
import { EnvironmentGuard } from './environment.guard'
import { ResetDbService } from './reset-db.service'

@UseGuards(
  new EnvironmentGuard(ProcessEnvironment.Development, ProcessEnvironment.Test),
)
@Controller('dev-test-db')
export class DevTestDbController {
  constructor(private readonly resetDbService: ResetDbService) {}

  @Post('reset')
  @HttpCode(HttpStatus.NO_CONTENT)
  async resetDb(): Promise<void> {
    return await this.resetDbService.resetDb()
  }
}
