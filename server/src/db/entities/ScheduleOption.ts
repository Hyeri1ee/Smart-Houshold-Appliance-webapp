import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {ScheduleEntry} from "./ScheduleEntry";

@Entity()
export class ScheduleOption {
  @PrimaryGeneratedColumn()
  schedule_option_id: number;

  @Column({type: 'text', nullable: false})
  key: string;

  @Column({type: 'text', nullable: false})
  value: string;

  @ManyToOne(() => ScheduleEntry, (schedule) => schedule.options)
  schedule: ScheduleEntry;
}