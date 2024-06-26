import {Column, Entity, OneToMany, PrimaryGeneratedColumn,} from "typeorm";
import {Timeslot} from "./Timeslot";
import {ScheduleEntry} from "./ScheduleEntry";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ type: 'varchar', length: 20, nullable: false })
  first_name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 60, nullable: false })
  password: string;

  @Column({ type: 'smallint', nullable: true })
  profile_type: number;

  @OneToMany(() => Timeslot, (schedule) => schedule.user)
  timeslots: Timeslot[];

  @OneToMany(() => Timeslot, (schedule) => schedule.user)
  schedule: ScheduleEntry[];
}