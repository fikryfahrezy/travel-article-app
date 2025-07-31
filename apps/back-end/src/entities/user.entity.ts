import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid", {
    name: "id",
    primaryKeyConstraintName: "user_id_primary_key",
  })
  id: string;

  @Index("user_username_unique", { unique: true })
  @Column({ type: "varchar", name: "username", nullable: false })
  username: string;

  @Column({ type: "varchar", name: "password", default: "", nullable: false })
  password: string;
}
