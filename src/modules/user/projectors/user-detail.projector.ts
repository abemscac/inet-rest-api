import { Repository } from 'typeorm'
import { BaseProjector } from '~/base-projectors/base-projector'
import { ImageSize, ImgurUtil } from '~/utils/imgur.util'
import { User } from '../user.entity'
import { IUserDetailViewModel } from '../view-models/i-user-detail.view-model'

export interface IUserDetailProjection {
  id: number
  username: string
  name: string | null
  avatarImageHash: string | null
  avatarImageExt: string | null
  createdArticleCount: number
  createdAt: Date
}

export class UserDetailProjector extends BaseProjector<
  User,
  IUserDetailViewModel,
  IUserDetailProjection
> {
  constructor(repository: Repository<User>, alias: string) {
    super(
      repository
        .createQueryBuilder(alias)
        .leftJoin('article', 'article', `article.author_id = ${alias}.id`)
        .select([
          `${alias}.id AS id`,
          `${alias}.username AS username`,
          `${alias}.name AS name`,
          `${alias}.avatarImageHash AS avatarImageHash`,
          `${alias}.avatarImageExt AS avatarImageExt`,
          'COUNT(article.id) AS createdArticleCount',
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
      createdArticleCount: Number(projection.createdArticleCount),
      createdAt: projection.createdAt,
    }))
  }
}
