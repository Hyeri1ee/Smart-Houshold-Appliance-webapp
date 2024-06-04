import {Column, Entity, ManyToOne, PrimaryColumn} from "typeorm";
import {Schedule} from "./schedule";

@Entity()
export class Time {
  @PrimaryColumn()
  time_id: number;

  @PrimaryColumn()
  schedule_id: number;

  @Column({ type: 'time', nullable: true })
  start_time: string;

  @Column({ type: 'time', nullable: true })
  end_time: string;

  @ManyToOne(() => Schedule, (schedule) => schedule.times)
  schedule: Schedule;
}