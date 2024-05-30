import {Column, Entity, ManyToOne, OneToMany, PrimaryColumn} from "typeorm";
import {User} from "./user";
import {Time} from "./time";

@Entity()
export class Schedule {
  @PrimaryColumn()
  schedule_id: number;

  @PrimaryColumn()
  user_id: number;

  @Column({ type: 'smallint', nullable: true })
  weekday: number;

  @OneToMany(() => Time, (time) => time.schedule)
  times: Time[]

  @ManyToOne(() => User, (user) => user.schedules)
  user: User;
}