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
import { PagableParamsValidationPipe } from 'src/pipes/pagable-params.validation.pipe'
import { PagableParams } from 'src/shared-params/pagable.params'
import { IPagableViewModel } from 'src/shared-view-models/i-pagable.view-model'
import { AccessTokenAuthGuard } from '../auth/guards/access-token.guard'
import { UserBrowseHistoryService } from './user-browse-history.service'
import { IUserBrowseHistoryViewModel } from './view-models/i-user-browse-history.view-model'

@UseGuards(AccessTokenAuthGuard)
@Controller('user-browse-histories')
export class UserBrowseHistoryController {
  constructor(
    private readonly userBrowseHistoryService: UserBrowseHistoryService,
  ) {}

  @Get()
  async findByQuery(
    @Query(PagableParamsValidationPipe) params: PagableParams,
  ): Promise<IPagableViewModel<IUserBrowseHistoryViewModel>> {
    return await this.userBrowseHistoryService.findByQuery(params)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.userBrowseHistoryService.deleteById(id)
  }

  @Delete('clear')
  @HttpCode(HttpStatus.NO_CONTENT)
  async clear(): Promise<void> {
    return await this.userBrowseHistoryService.clear()
  }
}
