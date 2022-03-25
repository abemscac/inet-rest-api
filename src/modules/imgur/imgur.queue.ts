export const ImgurQueueName = 'article'

export enum ImgurQueueEvent {
  RemoveImage = 'remove-image',
}

export interface IImgurQueuePayload {
  hash: string
}
