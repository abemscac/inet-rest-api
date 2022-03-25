export const ArticleQueueName = 'article'

export enum ArticleQueueEventType {
  RemoveCoverImage = 'remove-cover-image',
}

export interface IArticleQueuePayload {
  coverImageHash?: string
}
