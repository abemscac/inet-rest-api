import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Length } from 'class-validator'

export class AuthLoginForm {
  @ApiProperty({ example: 'username123' })
  @IsNotEmpty()
  @Length(4, 50)
  username: string

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  @Length(4, 60)
  password: string
}
