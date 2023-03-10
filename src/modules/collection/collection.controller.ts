import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { PagableQuery } from '~/shared-queries/pagable.query'
import { IPaginationViewModel } from '~/shared-view-models/i-pagination.view-model'
import { ApiBadRequestResponses } from '~/swagger-decorators/api-bad-request-responses'
import { ApiCreatedExample } from '~/swagger-decorators/api-created-example'
import { ApiNoContentSuccess } from '~/swagger-decorators/api-no-content-success'
import { ApiOkPagableExample } from '~/swagger-decorators/api-ok-pagable-example'
import { ApiWithAuth } from '~/swagger-decorators/api-with-auth'
import { ApiWithPermit } from '~/swagger-decorators/api-with-permit'
import { ApiWithTargetEntity } from '~/swagger-decorators/api-with-target-entity'
import { MockArticlesStripped } from '../article/article.mocks'
import { ARTICLE_BODY_PREVIEW_LENGTH } from '../article/projectors/article.projector'
import { AccessTokenAuthGuard } from '../auth/guards/access-token.guard'
import { MockCollections } from './collection.mocks'
import { CollectionService } from './collection.service'
import { CreateCollectionForm } from './forms/create-collection.form'
import { ICollectionViewModel } from './view-models/i-collection.view-model'

@ApiTags('Collections')
@UseGuards(AccessTokenAuthGuard)
@Controller('collections')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @ApiOperation({ summary: 'Find your collections by query (pagable)' })
  @ApiBadRequestResponses({ queryFormat: true })
  @ApiWithAuth()
  @ApiOkPagableExample(
    MockArticlesStripped,
    `The <code>body</code> of an article will only contain the first ${ARTICLE_BODY_PREVIEW_LENGTH} characters.`,
  )
  @Get()
  async findByQuery(
    @Query() query: PagableQuery,
  ): Promise<IPaginationViewModel<ICollectionViewModel>> {
    return await this.collectionService.findByQuery(query)
  }

  @ApiOperation({ summary: 'Create a collection' })
  @ApiWithAuth()
  @ApiBadRequestResponses({ bodyFormat: true })
  @ApiWithTargetEntity('article')
  @ApiCreatedExample(MockCollections[0])
  @UseGuards(AccessTokenAuthGuard)
  @Post()
  async create(
    @Body() form: CreateCollectionForm,
  ): Promise<ICollectionViewModel> {
    return await this.collectionService.create(form)
  }

  @ApiOperation({ summary: 'Delete a collection by id' })
  @ApiWithAuth()
  @ApiWithPermit()
  @ApiWithTargetEntity()
  @ApiNoContentSuccess()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.collectionService.deleteById(id)
  }
}
