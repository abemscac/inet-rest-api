import { IArticleCategoryDetailViewModel } from './view-models/i-article-category-detail.view-model'
import { IArticleCategoryViewModel } from './view-models/i-article-category.view-model'

export const MockArticleCategories: Array<IArticleCategoryViewModel> = [
  {
    id: 1,
    code: 'chat',
    imageUrl: 'https://i.imgur.com/cnGUSeYs.jpg',
  },
  {
    id: 2,
    code: 'animal',
    imageUrl: 'https://i.imgur.com/JR2xyV6s.jpg',
  },
  {
    id: 3,
    code: 'food',
    imageUrl: 'https://i.imgur.com/VpthdjVs.jpg',
  },
  {
    id: 4,
    code: 'travel',
    imageUrl: 'https://i.imgur.com/YZmNS4Ws.jpg',
  },
  {
    id: 5,
    code: 'programming',
    imageUrl: 'https://i.imgur.com/xMqW5bps.jpg',
  },
  {
    id: 6,
    code: 'sports',
    imageUrl: 'https://i.imgur.com/s4PDhtLs.jpg',
  },
]

export const MockArticleCategoryDetail: IArticleCategoryDetailViewModel = {
  ...MockArticleCategories[0],
  newArticleCountToday: 123,
}
