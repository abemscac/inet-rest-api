import { Test, TestingModule } from '@nestjs/testing'
import { ArticleCategoryService } from './article-category.service'

describe('ArticleCategoryService', () => {
  let service: ArticleCategoryService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticleCategoryService],
    }).compile()

    service = module.get<ArticleCategoryService>(ArticleCategoryService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('find all', async () => {
    const data = await service.findAll()
    expect(data.length).toBeGreaterThan(0)
  })
})
