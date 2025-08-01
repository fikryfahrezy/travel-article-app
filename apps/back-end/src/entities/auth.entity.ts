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
import { User } from "./user.entity";

@Entity({
  name: "auths",
})
export class Auth {
  @PrimaryGeneratedColumn("uuid", {
    name: "id",
    primaryKeyConstraintName: "auths_id_primary_key",
  })
  id: string;

  @Column({ type: "varchar", length: 255, name: "token", nullable: false })
  token: string;

  @Column({
    type: "varchar",
    length: 255,
    name: "refresh_token",
    nullable: false,
  })
  refreshToken: string;

  @Column({ type: "timestamptz", name: "expires_at", nullable: false })
  expiresAt: Date;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({
    name: "user_id",
    foreignKeyConstraintName: "auths_users_id_foreign_key",
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
