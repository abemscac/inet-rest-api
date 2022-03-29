import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNotEmpty, Length } from 'class-validator'

export class UserUpdatePasswordForm {
  @ApiProperty({ example: '1234' })
  @IsNotEmpty()
  @Length(4, 60)
  @Transform((params) => params.value?.trim())
  oldPassword: string

  @ApiProperty({ example: '5678' })
  @IsNotEmpty()
  @Length(4, 60)
  @Transform((params) => params.value?.trim())
  newPassword: string
}
