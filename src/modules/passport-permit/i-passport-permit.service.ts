import { IPassportPermitUser } from './i-passport-permit-user'

export interface IPassportPermitService {
  get user(): Readonly<IPassportPermitUser | undefined>
  permit(userId: number): void
}
