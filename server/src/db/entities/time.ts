import {Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {Schedule} from "./schedule";

@Entity()
export class Time {
  @PrimaryGeneratedColumn()
  time_id: number;

  @PrimaryColumn()
  schedule_id: number;

  @Column({type: 'time', nullable: false})
  start_time: string;

  @Column({type: 'time', nullable: false})
  end_time: string;

  @ManyToOne(() => Schedule, (schedule) => schedule.times)
  schedule: Schedule;
}