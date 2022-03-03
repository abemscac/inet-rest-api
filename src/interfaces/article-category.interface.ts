export interface ArticleCategory {
  id: number
  code: string
  /**
   * emoji
   */
  icon: string
  index: number
  createdAt: number
  removedAt?: number
  isRemoved: boolean
}
