import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Article } from './article.entity'

export interface IArticleService {
  // findById(id: number): Promise<IArticleViewModel>
  // findMostPopularByQuery(
  //   params: ArticleFindMostPopularByQueryParams,
  // ): Promise<IPagableViewModel<IArticleViewModel>>
  // create(form: ArticleCreateForm): Promise<IArticleViewModel>
  // updateById(id: number, form: ArticleUpdateForm): Promise<IArticleViewModel>
  // removeById(id: number): Promise<void>
}

@Injectable()
export class ArticleService implements IArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}
}
