import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BaseService } from 'src/base-service/base.service'
import { Repository } from 'typeorm'
import { PassportPermitService } from '../passport-permit/passport-permit.service'
import { UserUpdateForm } from './forms/user-update.form'
import { IUserService } from './i-user.service'
import { UserFindByUsernameOptions } from './options/user.find-by-username.options'
import { User } from './user.entity'

@Injectable()
export class UserService extends BaseService implements IUserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly passportPermitService: PassportPermitService,
  ) {
    super()
  }

  async findByUsername(
    username: string,
    options?: UserFindByUsernameOptions,
  ): Promise<User> {
    let user: User

    const params = {
      where: {
        username,
        isRemoved: false,
      },
    }

    // We can't write like this.
    // It'll say "Cannot read properties of undefined (reading 'manager') at Repository.findOne."
    // const find = options?.findOneOrFail
    //   ? this.userRepository.findOneOrFail
    //   : this.userRepository.findOne

    if (options?.findOneOrFail) {
      user = await this.userRepository.findOneOrFail(params)
    } else {
      user = await this.userRepository.findOne(params)
    }

    return user
  }

  async updateById(id: number, form: UserUpdateForm): Promise<void> {
    this.passportPermitService.permitOrFail(id)
    const user = await this.userRepository.findOneOrFail({ id })
    user.name = form.name
    user.avatarUrl = form.avatarUrl || null
    await this.userRepository.save(user)
  }
}
