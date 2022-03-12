import { ForbiddenException, Injectable } from '@nestjs/common'
import { IPassportPermitUser } from './i-passport-permit-user'
import { IPassportPermitService } from './i-passport-permit.service'
import { PassportPermitUser } from './passport-permit-user'

@Injectable()
export class PassportPermitService implements IPassportPermitService {
  constructor(private readonly passportPermitUser: PassportPermitUser) {}

  get user(): Readonly<IPassportPermitUser> {
    return this.passportPermitUser
  }

  permit(userId: number): void {
    if (userId !== this.user?.id) {
      throw new ForbiddenException()
    }
  }
}
