import {Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Unique} from "typeorm";
import {User} from "./User";
import {TimeslotTime} from "./TimeslotTime";

@Entity()
@Unique(["user_id", "weekday"])
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