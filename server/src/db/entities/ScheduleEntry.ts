import {Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./User";
import {ScheduleOption} from "./ScheduleOption";

@Entity()
export class ScheduleEntry {
  @PrimaryGeneratedColumn()
  schedule_id: number;

  @PrimaryColumn({type: "varchar", length: 36, nullable: false})
  schedule_uuid: string;

  @PrimaryColumn({nullable: false})
  user_id: number;

  @Column({type: 'timestamptz', nullable: false})
  datetime: Date;

  @Column({type: 'text', nullable: false})
  program: string;

  @OneToMany(() => ScheduleOption, (scheduleOption) => scheduleOption.schedule)
  options: ScheduleOption[]

  @ManyToOne(() => User, (user) => user.schedule)
  user: User;
}