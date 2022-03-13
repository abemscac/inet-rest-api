import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BaseService } from 'src/base-services/base.service'
import { Repository } from 'typeorm'
import { Article } from './article.entity'
import { IArticleService } from './i-article.service'

@Injectable()
export class ArticleService extends BaseService implements IArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {
    super()
  }
}
