import { Module } from '@nestjs/common'
import { PassportPermitService } from './passport-permit.service'

@Module({
  providers: [PassportPermitService],
  exports: [PassportPermitService],
})
export class PassportPermitModule {}
