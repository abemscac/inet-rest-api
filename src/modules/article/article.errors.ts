import { IBusinessLogicError } from '~/base-exceptions/business-logic.exception'

export enum ArticleErrorCode {
  CategoryDoesNotExist = 'ARTICLE_CATEGORY_DOES_NOT_EXIST',
}

export const ArticleErrors: Record<
  keyof typeof ArticleErrorCode,
  IBusinessLogicError
> = {
  CategoryDoesNotExist: {
    code: ArticleErrorCode.CategoryDoesNotExist,
    message: 'Provided category does not exist',
  },
}
