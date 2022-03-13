import { ForbiddenException, Inject, Injectable } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { Request } from 'express'
import { BaseService, IBaseService } from 'src/base-services/base.service'
import { IPassportPermitUser } from './i-passport-permit-user'

export interface IPassportPermitService extends IBaseService {
  /**
   * user and all of its' properties are guaranteed to exist if the AuthGuard
   * of the endpoint uses any TokenStrategy.
   */
  get user(): Readonly<IPassportPermitUser | undefined>
  permitOrFail(userId: number): void
}

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
