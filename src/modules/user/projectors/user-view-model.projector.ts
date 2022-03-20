import {
  BaseProjector,
  IBaseProjector,
} from 'src/base-projectors/base-projector'
import { IUserViewModel } from 'src/shared-view-models/i-user.view-model'
import { Repository } from 'typeorm'
import { User } from '../user.entity'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IUserViewModelProjector extends IBaseProjector<IUserViewModel> {}

export class UserViewModelProjector
  extends BaseProjector<User, IUserViewModel>
  implements IUserViewModelProjector
{
  constructor(repository: Repository<User>) {
    super(
      repository
        .createQueryBuilder('user')
        .select([
          'user.id AS id',
          'user.username AS username',
          'user.name AS name',
          'user.avatarUrl AS avatarUrl',
          'user.createdAt AS createdAt',
        ]),
    )
  }
}
