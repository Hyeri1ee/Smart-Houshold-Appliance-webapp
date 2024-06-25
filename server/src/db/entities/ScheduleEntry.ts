import {Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./User";
import {ScheduleOption} from "./ScheduleOption";

@Entity()
export class ScheduleEntry {
  @PrimaryGeneratedColumn()
  schedule_id: number;

  @PrimaryColumn({nullable: false})
  user_id: number;

  @Column({type: 'timestamp with local time zone', nullable: false})
  datetime: Date;

  @OneToMany(() => ScheduleOption, (scheduleOption) => scheduleOption.schedule)
  options: ScheduleOption[]

  @ManyToOne(() => User, (user) => user.timeslots)
  user: User;
}