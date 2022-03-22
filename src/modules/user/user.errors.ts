export enum UserErrorCodes {
  DuplicateUsername = 'USER_DUPE_USN',
  OldPasswordUnmatched = 'USER_PWD_UNMATCHED',
  PendingRemoval = 'USER_PEND_RMV',
}

export const UserErrors = {
  duplicateUsername: {
    code: UserErrorCodes.DuplicateUsername,
    message: 'Duplicate username',
  },
  oldPasswordUnmatched: {
    code: UserErrorCodes.OldPasswordUnmatched,
    message: 'Old password unmatched',
  },
  pendingRemoval: {
    code: UserErrorCodes.PendingRemoval,
    message: 'User removal is pending',
  },
}
