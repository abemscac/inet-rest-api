export enum UserErrorCodes {
  DuplicateUsername = 'USER-001',
  OldPasswordUnmatched = 'USER-002',
  PendingRemoval = 'USER-003',
}

export const UserErrors = {
  duplicateUsername: {
    code: UserErrorCodes.DuplicateUsername,
    message: 'Duplicate username.',
  },
  oldPasswordUnmatched: {
    code: UserErrorCodes.OldPasswordUnmatched,
    message: 'Old password unmatched.',
  },
  pendingRemoval: {
    code: UserErrorCodes.PendingRemoval,
    message: 'User removal is pending.',
  },
}
