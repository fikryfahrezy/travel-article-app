import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Article } from "./article.entity";
import { User } from "./user.entity";

@Entity({
  name: "article_likes",
})
@Index("article_likes_articles_users_unique", ["article", "user"], {
  unique: true,
})
export class ArticleLike {
  @PrimaryGeneratedColumn("uuid", {
    name: "id",
    primaryKeyConstraintName: "article_likes_id_primary_key",
  })
  id: string;

  @ManyToOne(() => Article, { nullable: false })
  @JoinColumn({
    name: "article_id",
    foreignKeyConstraintName: "article_likes_articles_id_foreign_key",
  })
  article: Article;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({
    name: "user_id",
    foreignKeyConstraintName: "article_likes_users_id_foreign_key",
  })
  user: User;

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
