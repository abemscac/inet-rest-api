import { Repository } from 'typeorm'
import { BaseProjector } from '~/base-projectors/base-projector'
import { IUserViewModel } from '~/shared-view-models/i-user.view-model'
import { User } from '../user.entity'

export class UserViewModelProjector extends BaseProjector<
  User,
  IUserViewModel
> {
  constructor(repository: Repository<User>, alias: string) {
    super(
      repository
        .createQueryBuilder(alias)
        .select([
          `${alias}.id AS id`,
          `${alias}.username AS username`,
          `${alias}.name AS name`,
          `${alias}.avatarImageHash AS avatarImageHash`,
          `${alias}.createdAt AS createdAt`,
        ]),
      alias,
    )
  }
}
