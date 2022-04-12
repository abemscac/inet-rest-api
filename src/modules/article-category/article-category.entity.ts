import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Creatable } from '~/base-entities/creatable.entity'
import { Article } from '../article/article.entity'

@Entity({ name: 'article_category' })
export class ArticleCategory extends Creatable {
  @PrimaryGeneratedColumn('increment', { type: 'smallint' })
  id: number

  @Column({
    type: 'varchar',
    length: 20,
    unique: true,
  })
  code: string

  @Column({
    type: 'varchar',
    length: 20,
    name: 'image_hash',
  })
  imageHash: string

  @Column({
    type: 'varchar',
    length: 5,
    name: 'image_ext',
  })
  imageExt: string

  // relations
  @OneToMany(() => Article, (article) => article.category)
  articles: Array<Article>
}
