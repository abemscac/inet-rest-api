import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PassportUser } from 'src/injectables/passport-user.injectable'
import { UserController } from './user.controller'
import { User } from './user.entity'
import { UserService } from './user.service'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [UserService],
  providers: [UserService, PassportUser],
  controllers: [UserController],
})
export class UserModule {}
