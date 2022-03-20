import { BaseProjector } from 'src/base-projectors/base-projector'
import { IUserViewModel } from 'src/shared-view-models/i-user.view-model'
import { Repository } from 'typeorm'
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
          `${alias}.avatarUrl AS avatarUrl`,
          `${alias}.createdAt AS createdAt`,
        ]),
      alias,
    )
  }
}
