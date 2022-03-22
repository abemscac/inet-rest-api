import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ImgurModule } from '../imgur/imgur.module'
import { PassportPermitModule } from '../passport-permit/passport-permit.module'
import { UserController } from './user.controller'
import { User } from './user.entity'
import { UserService } from './user.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportPermitModule,
    ImgurModule,
  ],
  exports: [UserService],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
