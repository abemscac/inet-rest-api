import { Repository } from 'typeorm'
import { BaseProjector } from '~/base-projectors/base-projector'
import { IUserViewModel } from '~/shared-view-models/i-user.view-model'
import { ImageSize, ImgurUtil } from '~/utils/imgur.util'
import { User } from '../user.entity'

export class UserProjector extends BaseProjector<User, IUserViewModel> {
  constructor(repository: Repository<User>, alias: string) {
    super(
      repository
        .createQueryBuilder(alias)
        .select([
          `${alias}.id AS id`,
          `${alias}.username AS username`,
          `${alias}.name AS name`,
          `${alias}.avatarImageHash AS avatarImageHash`,
          `${alias}.avatarImageExt AS avatarImageExt`,
          `${alias}.createdAt AS createdAt`,
        ]),
      alias,
    )
    super.setPipes((_, projection) => ({
      id: projection.id,
      username: projection.username,
      name: projection.name,
      avatarUrl: ImgurUtil.toLink({
        hash: projection.avatarImageHash,
        ext: projection.avatarImageExt,
        size: ImageSize.SmallSquare,
      }),
      createdAt: projection.createdAt,
    }))
  }
}
