import {Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./User";
import {TimeslotTime} from "./TimeslotTime";

@Entity()
export class Timeslot {
  @PrimaryGeneratedColumn()
  schedule_id: number;

  @PrimaryColumn({nullable: false})
  user_id: number;

  @Column({type: 'smallint', nullable: true})
  weekday: number;

  @OneToMany(() => TimeslotTime, (time) => time.schedule)
  times: TimeslotTime[]

  @ManyToOne(() => User, (user) => user.timeslots)
  user: User;
}