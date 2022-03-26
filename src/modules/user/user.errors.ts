import { IBusinessLogicError } from '~/base-exceptions/business-logic.exception'

export enum UserErrorCode {
  DuplicateUsername = 'USER_DUPLICATE_USERNAME',
  OldPasswordUnmatched = 'USER_OLD_PASSWORD_UNMATCHED',
  PendingRemoval = 'USER_PENDING_REMOVAL',
}

export const UserErrors: Record<
  keyof typeof UserErrorCode,
  IBusinessLogicError
> = {
  DuplicateUsername: {
    code: UserErrorCode.DuplicateUsername,
    message: 'Duplicate username',
  },
  OldPasswordUnmatched: {
    code: UserErrorCode.OldPasswordUnmatched,
    message: 'Old password unmatched',
  },
  PendingRemoval: {
    code: UserErrorCode.PendingRemoval,
    message: 'User removal is pending',
  },
}
