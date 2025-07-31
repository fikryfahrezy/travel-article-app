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
  name: "comments",
})
export class Comment {
  @PrimaryGeneratedColumn("uuid", {
    name: "id",
    primaryKeyConstraintName: "comments_id_primary_key",
  })
  id: string;

  @Column({ type: "text", name: "content", default: "", nullable: false })
  content: string;

  @ManyToOne(() => Article)
  @JoinColumn({
    name: "article_id",
    foreignKeyConstraintName: "comments_articles_id_foreign_key",
  })
  article: User;

  @ManyToOne(() => User)
  @JoinColumn({
    name: "author_id",
    foreignKeyConstraintName: "comments_users_id_foreign_key",
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
  deletedAt: Date;
}
