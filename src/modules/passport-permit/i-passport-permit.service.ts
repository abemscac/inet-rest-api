import { IPassportPermitUser } from './i-passport-permit-user'

export interface IPassportPermitService {
  /**
   * user and all of its' properties are guaranteed to exist if the AuthGuard
   * of the endpoint uses any TokenStrategy.
   */
  get user(): Readonly<IPassportPermitUser | undefined>
  permitOrFail(userId: number): void
}
