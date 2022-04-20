import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PagableQuery } from '~/shared-queries/pagable.query'
import { IPagableViewModel } from '~/shared-view-models/i-pagable.view-model'
import { TypeORMUtil } from '~/utils/typeorm.util'
import { Article } from '../article/article.entity'
import { PassportPermitService } from '../passport-permit/passport-permit.service'
import { Collection } from './collection.entity'
import { CreateCollectionForm } from './forms/create-collection.form'
import { CollectionProjector } from './projector/collection.projector'
import { ICollectionViewModel } from './view-models/i-collection.view-model'

export interface ICollectionService {
  findByQuery(
    query: PagableQuery,
  ): Promise<IPagableViewModel<ICollectionViewModel>>
  create(form: CreateCollectionForm): Promise<ICollectionViewModel>
  deleteById(id: number): Promise<void>
}

@Injectable()
export class CollectionService implements ICollectionService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    private readonly passportPermitService: PassportPermitService,
  ) {}

  async findByQuery(
    query: PagableQuery,
  ): Promise<IPagableViewModel<ICollectionViewModel>> {
    return new CollectionProjector(this.collectionRepository, 'collection')
      .where('collection.userId = :userId', {
        userId: this.passportPermitService.user?.id ?? 0,
      })
      .orderBy('collection.id', 'DESC')
      .projectPagination(query)
  }

  async create(form: CreateCollectionForm): Promise<ICollectionViewModel> {
    const { id: userId = 0 } = this.passportPermitService.user ?? {}
    const { articleId } = form
    await TypeORMUtil.existOrFail(this.articleRepository, {
      id: articleId,
    })
    const prevCollection = await this.collectionRepository.findOne(
      {
        userId,
        articleId,
      },
      {
        select: ['id'],
      },
    )
    let collectionId = 0
    if (prevCollection) {
      collectionId = prevCollection.id
    } else {
      // create
      const collection = this.collectionRepository.create({
        userId,
        articleId,
      })
      await this.collectionRepository.insert(collection)
      collectionId = collection.id
    }
    return new CollectionProjector(this.collectionRepository, 'collection')
      .where('collection.id = :collectionId', { collectionId })
      .project()
  }

  async deleteById(id: number): Promise<void> {
    const collection = await this.collectionRepository.findOneOrFail(
      { id },
      {
        select: ['userId'],
      },
    )
    this.passportPermitService.permitOrFail(collection.userId)
    await this.collectionRepository.delete({ id })
  }
}
