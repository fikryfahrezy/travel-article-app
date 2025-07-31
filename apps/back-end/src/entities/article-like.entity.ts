import {
  CreateDateColumn,
  Entity,
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
export class ArticleLike {
  @PrimaryGeneratedColumn("uuid", {
    name: "id",
    primaryKeyConstraintName: "article_likes_id_primary_key",
  })
  id: string;

  @ManyToOne(() => Article)
  @JoinColumn({
    name: "article_id",
    foreignKeyConstraintName: "article_likes_articles_id_foreign_key",
  })
  article: User;

  @ManyToOne(() => User)
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
}
