import {Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn,} from "typeorm";
import {Schedule} from "./schedule";
import {Location} from "./location";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ type: 'varchar', length: 20, nullable: false })
  first_name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 60, nullable: false })
  password: string;

  @Column({ type: 'smallint', nullable: true })
  profile_type: number;


  @OneToOne(() => Location)
  @JoinColumn()
  location: Location;

  @OneToMany(() => Schedule, (schedule) => schedule.user)
  schedules: Schedule[];
}