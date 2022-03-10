import { Inject, Injectable } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { Request } from 'express'
import { IPassportUser } from 'src/modules/auth/interfaces/i-passport-user'

@Injectable()
export class PassportUser implements IPassportUser {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}

  private get(): IPassportUser | undefined {
    return this.request.user as IPassportUser | undefined
  }

  get id(): number | undefined {
    return this.get()?.id
  }
}
