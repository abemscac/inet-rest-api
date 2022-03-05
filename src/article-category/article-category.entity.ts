import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Article } from '../article/article.entity'
import { Removable } from '../base-entities/removable.entity'

@Entity({ name: 'article_category' })
export class ArticleCategory extends Removable {
  @PrimaryGeneratedColumn('increment', { type: 'tinyint' })
  id: number

  @Column({
    type: 'varchar',
    length: 20,
  })
  code: string

  @Column({
    type: 'varchar',
    length: 20,
  })
  icon: string

  @Column({
    type: 'tinyint',
  })
  index: number

  // relations
  @OneToMany(() => Article, (article) => article.category)
  articles: Array<Article>
}
