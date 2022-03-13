import {
  BaseProjector,
  IBaseProjector,
} from 'src/base-projectors/base-projector'
import { Repository } from 'typeorm'
import { ArticleComment } from '../article-comment.entity'
import { IArticleCommentViewModel } from '../view-models/i-article-comment.view-model'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IArticleCommentViewModelProjector
  extends IBaseProjector<ArticleComment, IArticleCommentViewModel> {}

export class ArticleCommentViewModelProjector
  extends BaseProjector<ArticleComment, IArticleCommentViewModel>
  implements IArticleCommentViewModelProjector
{
  constructor(repository: Repository<ArticleComment>) {
    super(
      repository
        .createQueryBuilder('comment')
        .innerJoin('comment.author', 'author')
        .select([
          'comment.id',
          'comment.body',
          'comment.createdAt',
          'author.id',
          'author.username',
          'author.name',
          'author.avatarUrl',
          'author.createdAt',
        ]),
    )
  }
}
