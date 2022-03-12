import { Module } from '@nestjs/common'
import { PassportPermitUser } from './passport-permit-user'
import { PassportPermitService } from './passport-permit.service'

@Module({
  providers: [PassportPermitUser, PassportPermitService],
  exports: [PassportPermitService],
})
export class PassportPermitModule {}
