import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Auth {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id: string;

  @Column({ type: "varchar", name: "token", nullable: false })
  token: string;

  @Column({ type: "varchar", name: "refresh_token", nullable: false })
  refreshToken: string;

  @Column({ type: "timestamptz", name: "expires_at", nullable: false })
  expiresAt: Date;

  @OneToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @CreateDateColumn()
  @Column({ type: "timestamptz", name: "created_at", nullable: false })
  createdAt: Date;

  @DeleteDateColumn()
  @Column({ type: "timestamptz", name: "deleted_at", nullable: false })
  deletedAt: Date;
}
