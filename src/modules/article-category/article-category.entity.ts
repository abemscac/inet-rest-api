import { Removable } from 'src/base-entities/removable.entity'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Article } from '../article/article.entity'

@Entity({ name: 'article_category' })
export class ArticleCategory extends Removable {
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
    name: 'image_url',
  })
  imageUrl: string

  // relations
  @OneToMany(() => Article, (article) => article.category)
  articles: Array<Article>
}
