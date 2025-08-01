import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({
  name: "users",
})
export class User {
  @PrimaryGeneratedColumn("uuid", {
    name: "id",
    primaryKeyConstraintName: "users_id_primary_key",
  })
  id: string;

  @Index("users_username_unique", { unique: true })
  @Column({ type: "varchar", length: 50, name: "username", nullable: false })
  username: string;

  @Column({
    type: "varchar",
    length: 255,
    name: "password",
    default: "",
    nullable: false,
  })
  password: string;

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
