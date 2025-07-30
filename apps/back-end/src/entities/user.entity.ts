import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id: string;

  @Column({ type: "varchar", name: "username", nullable: false })
  username: string;

  @Column({ type: "varchar", name: "password", default: "", nullable: false })
  password: string;
}
