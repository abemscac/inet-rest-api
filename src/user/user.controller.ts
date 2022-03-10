import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { IUserViewModel } from 'src/shared-view-models/i-user.view-model'
import { UserUpdateForm } from './forms/user-update.form'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':username')
  async findByUsername(
    @Param('username') username: string,
  ): Promise<IUserViewModel> {
    return await this.userService.findByUsername(username, {
      findOneOrFail: true,
    })
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateById(
    @Param('id') id: number,
    @Body() form: UserUpdateForm,
  ): Promise<void> {
    return await this.userService.updateById(id, form)
  }
}
