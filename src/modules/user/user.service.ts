import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { BusinessLogicException } from 'src/base-exceptions/business-logic.exception'
import { IUserViewModel } from 'src/shared-view-models/i-user.view-model'
import { TypeORMUtil } from 'src/utils/typeorm.util'
import { Repository } from 'typeorm'
import { PassportPermitService } from '../passport-permit/passport-permit.service'
import { UserCreateForm } from './forms/user-create.form'
import { UserUpdatePasswordForm } from './forms/user-update-password.form'
import { UserUpdateProfileForm } from './forms/user-update-profile.form'
import { UserViewModelProjector } from './projectors/user-view-model.projector'
import { User } from './user.entity'
import { UserErrors } from './user.errors'

export interface IUserService {
  findByUsername(username: string): Promise<IUserViewModel>
  create(form: UserCreateForm): Promise<IUserViewModel>
  updateProfile(form: UserUpdateProfileForm): Promise<void>
  updatePassword(form: UserUpdatePasswordForm): Promise<void>
  remove(): Promise<void>
}

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly passportPermitService: PassportPermitService,
  ) {}

  async findByUsername(username: string): Promise<IUserViewModel> {
    return await new UserViewModelProjector(this.userRepository, 'user')
      .where('username = :username AND is_removed = :isRemoved', {
        username,
        isRemoved: false,
      })
      .projectOrFail()
  }

  async create(form: UserCreateForm): Promise<IUserViewModel> {
    const { username, password, name } = form
    const duplicateUsername = await TypeORMUtil.exist(this.userRepository, {
      username,
    })
    if (duplicateUsername) {
      throw new BusinessLogicException(UserErrors.duplicateUsername)
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
      name: name?.trim() || null,
      avatarImageHash: 'TODO',
    })
    await this.userRepository.insert(user)
    return {
      id: user.id,
      username,
      name: user.name,
      avatarUrl: user.avatarImageHash,
      createdAt: user.createdAt,
    }
  }

  async updateProfile(form: UserUpdateProfileForm): Promise<void> {
    const { id } = this.passportPermitService.user
    await TypeORMUtil.existOrFail(this.userRepository, { id, isRemoved: false })
    await this.userRepository.update(
      { id },
      {
        name: form.name?.trim() || null,
        avatarImageHash: 'TODO',
      },
    )
  }

  async updatePassword(form: UserUpdatePasswordForm): Promise<void> {
    const { id } = this.passportPermitService.user
    const user = await this.userRepository.findOneOrFail(
      {
        id,
        isRemoved: false,
      },
      {
        select: ['password'],
      },
    )
    const { oldPassword, newPassword } = form
    const passwordMatched = await bcrypt.compare(oldPassword, user.password)
    if (!passwordMatched) {
      throw new BusinessLogicException(UserErrors.oldPasswordUnmatched)
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10)
    await this.userRepository.update(
      { id },
      { password: hashedNewPassword, refreshTokenHash: null },
    )
  }

  async remove(): Promise<void> {
    const { id } = this.passportPermitService.user
    const user = await this.userRepository.findOne(
      {
        id,
      },
      {
        select: ['isRemoved'],
      },
    )
    if (!user) {
      throw new NotFoundException()
    } else if (user.isRemoved) {
      throw new BusinessLogicException(UserErrors.pendingRemoval)
    } else {
      await this.userRepository.update(
        { id },
        {
          refreshTokenHash: null,
          removedAt: new Date(),
          isRemoved: true,
        },
      )
    }
  }
}
