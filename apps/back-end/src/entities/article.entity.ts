import { default as slugify } from "slugify";
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { generateOpaqueToken } from "../lib/token";
import { User } from "./user.entity";

@Entity({
  name: "articles",
})
export class Article {
  @PrimaryGeneratedColumn("uuid", {
    name: "id",
    primaryKeyConstraintName: "articles_id_primary_key",
  })
  id: string;

  @Column({ type: "varchar", length: 100, name: "title", nullable: false })
  title: string;

  @Index("articles_slug_unique", { unique: true })
  @Column({ type: "varchar", length: 100, name: "slug", nullable: false })
  slug: string;

  @Column({ type: "text", name: "content", default: "", nullable: false })
  content: string;

  @ManyToOne(() => User)
  @JoinColumn({
    name: "author_id",
    foreignKeyConstraintName: "articles_users_id_foreign_key",
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

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    // Just reuse the function for generate random string.
    // It doesn't have anything todo with opaque token or something.
    this.slug = slugify(`${this.title}-${generateOpaqueToken(8)}`, {
      lower: true,
    });
  }
}
