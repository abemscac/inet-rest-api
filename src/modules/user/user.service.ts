import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { Repository } from 'typeorm'
import { BusinessLogicException } from '~/base-exceptions/business-logic.exception'
import { IUserViewModel } from '~/shared-view-models/i-user.view-model'
import { ImgurUtil } from '~/utils/imgur.util'
import { TypeORMUtil } from '~/utils/typeorm.util'
import { ImgurAlbum } from '../imgur/imgur.constants'
import { ImgurService } from '../imgur/imgur.service'
import { PassportPermitService } from '../passport-permit/passport-permit.service'
import { CreateUserForm } from './forms/create-user.form'
import { UpdateAvatarForm } from './forms/update-avatar-form'
import { UpdatePasswordForm } from './forms/update-password.form'
import { UpdateProfileForm } from './forms/update-profile.form'
import { UserDetailProjector } from './projectors/user-detail.projector'
import { User } from './user.entity'
import { UserErrors } from './user.errors'
import { IUserDetailViewModel } from './view-models/i-user-detail.view-model'

export interface IUserService {
  findByUsername(username: string): Promise<IUserDetailViewModel>
  create(form: CreateUserForm): Promise<IUserViewModel>
  updateMyAvatar(form: UpdateAvatarForm): Promise<string>
  removeMyAvatar(): Promise<void>
  updateMyProfile(form: UpdateProfileForm): Promise<void>
  updateMyPassword(form: UpdatePasswordForm): Promise<void>
  remove(): Promise<void>
}

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly passportPermitService: PassportPermitService,
    private readonly imgurService: ImgurService,
  ) {}

  async findByUsername(username: string): Promise<IUserDetailViewModel> {
    return await new UserDetailProjector(this.userRepository, 'user')
      .where('user.username = :username AND user.is_removed = :isRemoved', {
        username,
        isRemoved: false,
      })
      .projectOrFail()
  }

  async create(form: CreateUserForm): Promise<IUserViewModel> {
    const { username, password, name } = form
    const duplicateUsername = await TypeORMUtil.exist(this.userRepository, {
      username,
    })
    if (duplicateUsername) {
      throw new BusinessLogicException(UserErrors.DuplicateUsername)
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = this.userRepository.create({
      username,
      hashedPassword,
      name: name || null,
    })

    let avatarHash = '',
      avatarUrl: string | null = null
    try {
      if (form.avatar) {
        const image = await this.imgurService.uploadImage(form.avatar, {
          album: ImgurAlbum.UserAvatar,
        })
        avatarHash = image.id
        avatarUrl = image.link
        user.avatarImageHash = image.id
        user.avatarImageExt = ImgurUtil.getExtFromLink(image.link)
      }
      await this.userRepository.insert(user)
    } catch (error) {
      if (avatarHash) {
        await this.imgurService.deleteImage(avatarHash)
      }
      throw error
    }

    return {
      id: user.id,
      username,
      name: user.name,
      avatarUrl,
      createdAt: user.createdAt,
    }
  }

  async updateMyAvatar(form: UpdateAvatarForm): Promise<string> {
    const { id = 0 } = this.passportPermitService.user ?? {}
    const user = await this.userRepository.findOneOrFail(
      { id, isRemoved: false },
      {
        select: ['avatarImageHash'],
      },
    )

    let newImageHash = '',
      newImageLink = ''
    try {
      const newImage = await this.imgurService.uploadImage(form.avatar, {
        album: ImgurAlbum.UserAvatar,
      })
      newImageHash = newImage.id
      await this.userRepository.update(
        { id },
        {
          avatarImageHash: newImageHash,
          avatarImageExt: ImgurUtil.getExtFromLink(newImage.link),
        },
      )
      newImageLink = newImage.link
    } catch (error) {
      if (newImageHash) {
        await this.imgurService.deleteImage(newImageHash)
      }
      throw error
    }

    // remove previous avatar when needed
    if (user.avatarImageHash) {
      await this.imgurService.deleteImage(user.avatarImageHash)
    }

    return newImageLink
  }

  async removeMyAvatar(): Promise<void> {
    const { id = 0 } = this.passportPermitService.user ?? {}
    const user = await this.userRepository.findOneOrFail(
      { id, isRemoved: false },
      {
        select: ['avatarImageHash'],
      },
    )
    if (user.avatarImageHash) {
      await this.userRepository.update(
        { id },
        {
          avatarImageHash: null,
          avatarImageExt: null,
        },
      )
      await this.imgurService.deleteImage(user.avatarImageHash)
    }
  }

  async updateMyProfile(form: UpdateProfileForm): Promise<void> {
    const { id = 0 } = this.passportPermitService.user ?? {}
    await TypeORMUtil.existOrFail(this.userRepository, {
      id,
      isRemoved: false,
    })
    await this.userRepository.update(
      { id },
      {
        name: form.name || null,
      },
    )
  }

  async updateMyPassword(form: UpdatePasswordForm): Promise<void> {
    const { id = 0 } = this.passportPermitService.user ?? {}
    const user = await this.userRepository.findOneOrFail(
      {
        id,
        isRemoved: false,
      },
      {
        select: ['hashedPassword'],
      },
    )

    const { oldPassword, newPassword } = form
    const passwordMatched = await bcrypt.compare(
      oldPassword,
      user.hashedPassword,
    )
    if (!passwordMatched) {
      throw new BusinessLogicException(UserErrors.OldPasswordUnmatched)
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10)
    await this.userRepository.update(
      { id },
      {
        hashedPassword: hashedNewPassword,
        hashedRefreshToken: null,
      },
    )
  }

  async remove(): Promise<void> {
    const { id = 0 } = this.passportPermitService.user ?? {}
    await TypeORMUtil.existOrFail(this.userRepository, { id, isRemoved: false })
    await this.userRepository.update(
      { id },
      {
        hashedRefreshToken: null,
        removedAt: new Date(),
        isRemoved: true,
      },
    )
  }
}
