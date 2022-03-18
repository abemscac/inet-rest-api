import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { PagableParams } from 'src/shared-params/pagable.params'
import { IPagableViewModel } from 'src/shared-view-models/i-pagable.view-model'
import { AccessTokenAuthGuard } from '../auth/guards/access-token.guard'
import { UserBrowseHistoryCreateForm } from './forms/user-browse-history-create.form'
import { UserBrowseHistoryService } from './user-browse-history.service'
import { IUserBrowseHistoryViewModel } from './view-models/i-user-browse-history.view-model'

@UseGuards(AccessTokenAuthGuard)
@Controller('/user-browse-histories')
export class UserBrowseHistoryController {
  constructor(
    private readonly userBrowseHistoryService: UserBrowseHistoryService,
  ) {}

  @Get()
  async findByQuery(
    @Query() params: PagableParams,
  ): Promise<IPagableViewModel<IUserBrowseHistoryViewModel>> {
    return await this.userBrowseHistoryService.findByQuery(params)
  }

  @Post()
  async create(
    @Body() form: UserBrowseHistoryCreateForm,
  ): Promise<IUserBrowseHistoryViewModel> {
    return await this.userBrowseHistoryService.create(form)
  }

  @Delete(':id')
  async removeById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.userBrowseHistoryService.removeById(id)
  }

  @Delete('clear')
  async clear(): Promise<void> {
    return await this.userBrowseHistoryService.clear()
  }
}
