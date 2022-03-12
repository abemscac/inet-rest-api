import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { PassportPermitModule } from '../passport-permit/passport-permit.module'
import { UserModule } from '../user/user.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { AccessTokenStrategy } from './strategies/access-token.strategy'
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy'

@Module({
  imports: [
    JwtModule.register({}),
    UserModule,
    PassportModule,
    PassportPermitModule,
  ],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
