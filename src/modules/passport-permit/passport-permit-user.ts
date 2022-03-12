import { Inject, Injectable } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { Request } from 'express'
import { IPassportPermitUser } from './i-passport-permit-user'

@Injectable()
export class PassportPermitUser implements IPassportPermitUser {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}

  private get requestUser(): IPassportPermitUser | undefined {
    return this.request.user as IPassportPermitUser | undefined
  }

  get id(): number | undefined {
    return this.requestUser?.id
  }

  get username(): string | undefined {
    return this.requestUser?.username
  }
}
