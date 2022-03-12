import { ForbiddenException, Inject, Injectable } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { Request } from 'express'
import { BaseService } from 'src/base-service/base.service'
import { IPassportPermitUser } from './i-passport-permit-user'
import { IPassportPermitService } from './i-passport-permit.service'

@Injectable()
export class PassportPermitService
  extends BaseService
  implements IPassportPermitService
{
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
  ) {
    super()
  }

  get user(): Readonly<IPassportPermitUser | undefined> {
    return this.request.user as Readonly<IPassportPermitUser | undefined>
  }

  permitOrFail(userId: number): void {
    if (userId !== this.user?.id) {
      throw new ForbiddenException()
    }
  }
}
