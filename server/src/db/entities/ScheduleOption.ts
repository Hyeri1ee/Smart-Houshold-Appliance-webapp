import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {ScheduleEntry} from "./ScheduleEntry";

@Entity()
export class ScheduleOption {
  @PrimaryGeneratedColumn()
  schedule_option_id: number;

  @Column({type: 'string', nullable: false})
  key: string;

  @Column({type: 'string', nullable: false})
  value: string;

  @ManyToOne(() => ScheduleEntry, (schedule) => schedule.options)
  schedule: ScheduleEntry;
}