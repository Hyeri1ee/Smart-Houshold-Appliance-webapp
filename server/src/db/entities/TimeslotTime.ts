import {Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {Timeslot} from "./Timeslot";

@Entity()
export class TimeslotTime {
  @PrimaryGeneratedColumn()
  time_id: number;

  @PrimaryColumn()
  schedule_id: number;

  @Column({type: 'time', nullable: false})
  start_time: string;

  @Column({type: 'time', nullable: false})
  end_time: string;

  @ManyToOne(() => Timeslot, (schedule) => schedule.times)
  schedule: Timeslot;
}