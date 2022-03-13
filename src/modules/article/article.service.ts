import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BaseService, IBaseService } from 'src/base-services/base.service'
import { Repository } from 'typeorm'
import { Article } from './article.entity'

export interface IArticleService extends IBaseService {
  // findById(id: number): Promise<IArticleViewModel>
  // findMostPopularByQuery(
  //   params: ArticleFindMostPopularByQueryParams,
  // ): Promise<IPagableViewModel<IArticleViewModel>>
  // create(form: ArticleCreateForm): Promise<IArticleViewModel>
  // updateById(id: number, form: ArticleUpdateForm): Promise<IArticleViewModel>
  // removeById(id: number): Promise<void>
}

@Injectable()
export class ArticleService extends BaseService implements IArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {
    super()
  }
}
