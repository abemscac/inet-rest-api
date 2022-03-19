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
        .where('user.isRemoved = 0')
        .select([
          'user.id',
          'user.username',
          'user.name',
          'user.avatarUrl',
          'user.createdAt',
        ]),
    )
  }
}
