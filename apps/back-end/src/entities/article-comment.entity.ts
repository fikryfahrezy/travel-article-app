import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Article } from "./article.entity";
import { User } from "./user.entity";

@Entity({
  name: "article_comments",
})
export class ArticleComment {
  @PrimaryGeneratedColumn("uuid", {
    name: "id",
    primaryKeyConstraintName: "article_comments_id_primary_key",
  })
  id: string;

  @Column({ type: "text", name: "content", default: "", nullable: false })
  content: string;

  @ManyToOne(() => Article, { nullable: false })
  @JoinColumn({
    name: "article_id",
    foreignKeyConstraintName: "article_comments_articles_id_foreign_key",
  })
  article: Article;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({
    name: "author_id",
    foreignKeyConstraintName: "article_comments_users_id_foreign_key",
  })
  author: User;

  @CreateDateColumn({
    type: "timestamptz",
    name: "created_at",
    nullable: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamptz",
    name: "updated_at",
    nullable: false,
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: "timestamptz",
    name: "deleted_at",
    nullable: true,
  })
  deletedAt: Date | null;
}
