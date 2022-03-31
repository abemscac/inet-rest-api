import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { PagableParamsValidationPipe } from '~/pipes/pagable-params.validation.pipe'
import { PagableParams } from '~/shared-params/pagable.params'
import { IPagableViewModel } from '~/shared-view-models/i-pagable.view-model'
import { ApiBadRequestResponses } from '~/swagger-decorators/api-bad-request-responses'
import { ApiNoContentSuccess } from '~/swagger-decorators/api-no-content-success'
import { ApiOkExample } from '~/swagger-decorators/api-ok-example'
import { ApiWithAuth } from '~/swagger-decorators/api-with-auth'
import { ApiWithPermit } from '~/swagger-decorators/api-with-permit'
import { ApiWithTargetEntity } from '~/swagger-decorators/api-with-target-entity'
import { AccessTokenAuthGuard } from '../auth/guards/access-token.guard'
import { MockUserBrowseHistoryViewModels } from './user-browse-history.mocks'
import { UserBrowseHistoryService } from './user-browse-history.service'
import { IUserBrowseHistoryViewModel } from './view-models/i-user-browse-history.view-model'

@ApiTags('User Browse Histories')
@UseGuards(AccessTokenAuthGuard)
@Controller('user-browse-histories')
export class UserBrowseHistoryController {
  constructor(
    private readonly userBrowseHistoryService: UserBrowseHistoryService,
  ) {}

  @ApiOperation({ summary: 'Find your browse histories by query (pagable)' })
  @ApiBadRequestResponses({ queryFormat: true })
  @ApiWithAuth()
  @ApiOkExample(MockUserBrowseHistoryViewModels)
  @Get()
  async findByQuery(
    @Query(PagableParamsValidationPipe) params: PagableParams,
  ): Promise<IPagableViewModel<IUserBrowseHistoryViewModel>> {
    return await this.userBrowseHistoryService.findByQuery(params)
  }

  @ApiOperation({ summary: 'Delete an browse history by id' })
  @ApiWithAuth()
  @ApiWithPermit()
  @ApiWithTargetEntity()
  @ApiNoContentSuccess()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.userBrowseHistoryService.deleteById(id)
  }

  @ApiOperation({ summary: 'Clear all of your browse histories' })
  @ApiWithAuth()
  @ApiNoContentSuccess()
  @Delete('clear')
  @HttpCode(HttpStatus.NO_CONTENT)
  async clear(): Promise<void> {
    return await this.userBrowseHistoryService.clear()
  }
}
