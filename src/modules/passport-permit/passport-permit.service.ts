import { ForbiddenException, Inject, Injectable } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { Request } from 'express'
import { IPassportPermitUser } from './i-passport-permit-user'

export interface IPassportPermitService {
  /**
   * User and all of its' properties are guaranteed to exist if:
   * - the AuthGuard of the endpoint uses any TokenStrategy, and
   * - the endpoint is not marked with @IsPublic() decorator
   */
  get user(): Readonly<IPassportPermitUser | undefined>
  permitOrFail(userId: number): void
}

@Injectable()
export class PassportPermitService implements IPassportPermitService {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}

  get user(): Readonly<IPassportPermitUser | undefined> {
    return this.request.user as Readonly<IPassportPermitUser | undefined>
  }

  /**
   * Compare provided userId with passport userId. Throw ForbiddenException when unmatched.
   */
  permitOrFail(entityUserId: number): void {
    if (entityUserId !== this.user?.id) {
      throw new ForbiddenException()
    }
  }
}
