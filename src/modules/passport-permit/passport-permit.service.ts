import { ForbiddenException, Inject, Injectable } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { Request } from 'express'
import { IPassportPermitUser } from './i-passport-permit-user'
import { IPassportPermitService } from './i-passport-permit.service'

@Injectable()
export class PassportPermitService implements IPassportPermitService {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}

  get user(): Readonly<IPassportPermitUser | undefined> {
    return this.request.user as Readonly<IPassportPermitUser | undefined>
  }

  permit(userId: number): void {
    if (userId !== this.user?.id) {
      throw new ForbiddenException()
    }
  }
}
