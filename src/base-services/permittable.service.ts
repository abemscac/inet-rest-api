import { ForbiddenException } from '@nestjs/common'
import { PassportUser } from 'src/injectables/passport-user.injectable'

export class PermittableService {
  constructor(private readonly _passportUser: PassportUser) {}

  permit(userId: number) {
    if (this._passportUser.id !== userId) {
      throw new ForbiddenException()
    }
  }
}
