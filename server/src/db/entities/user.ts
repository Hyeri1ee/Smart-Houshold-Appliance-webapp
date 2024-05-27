import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToMany,
  OneToOne,
} from "typeorm";
import { Schedule } from "./schedule";
import { Location } from "./location";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ type: 'varchar', length: 20, nullable: false })
  first_name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @OneToOne(() => Location)
  @JoinColumn()
  location: Location;

  @OneToMany(() => Schedule, (schedule) => schedule.user)
  schedules: Schedule[];
}