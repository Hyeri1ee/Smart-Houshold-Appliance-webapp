import {Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Unique} from "typeorm";
import {User} from "./user";
import {Time} from "./time";

@Entity()
@Unique(["user_id", "weekday"])
export class Schedule {
  @PrimaryGeneratedColumn()
  schedule_id: number;

  @PrimaryColumn({nullable: false})
  user_id: number;

  @Column({type: 'smallint', nullable: true})
  weekday: number;

  @OneToMany(() => Time, (time) => time.schedule)
  times: Time[]

  @ManyToOne(() => User, (user) => user.schedule)
  user: User;
}