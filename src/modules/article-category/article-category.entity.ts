import { Creatable } from 'src/base-entities/creatable.entity'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
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
    length: 2000,
    name: 'image_hash',
  })
  imageHash: string

  // relations
  @OneToMany(() => Article, (article) => article.category)
  articles: Array<Article>
}
