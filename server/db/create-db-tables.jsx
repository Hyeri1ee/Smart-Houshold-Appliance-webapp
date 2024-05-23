import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  location_id: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  first_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string;

  @ManyToOne(() => Location, (location) => location.users)
  @JoinColumn({ name: 'location_id' })
  location: Location;
}

@Entity()
export class Schedule {
  @PrimaryColumn()
  schedule_id: number;

  @PrimaryColumn()
  user_id: number;

  @Column({ type: 'smallint', nullable: true })
  weekday: number;

  @ManyToOne(() => User, (user) => user.schedules)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  location_id: number;

  @Column({ type: 'float', nullable: true })
  longitude: number;

  @Column({ type: 'float', nullable: true })
  latitude: number;

  users: User[];
  solar_setups: SolarSetup[];
}

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
  @JoinColumn({ name: 'schedule_id' })
  schedule: Schedule;
}

@Entity()
export class SolarSetup {
  @PrimaryColumn()
  solar_setup_id: number;

  @PrimaryColumn()
  location_id: number;

  @Column({ type: 'smallint', nullable: true })
  panel_count: number;

  @Column({ type: 'smallint', nullable: true })
  panel_type: number;

  @Column({ type: 'float', nullable: true })
  panel_area: number;

  @Column({ type: 'float', nullable: true })
  tilt: number;

  @Column({ type: 'float', nullable: true })
  azimuth: number;

  @Column({ type: 'float', nullable: true })
  peak_power: number;

  @ManyToOne(() => Location, (location) => location.solar_setups)
  @JoinColumn({ name: 'location_id' })
  location: Location;
}

@Entity()
export class RevokedToken {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  revoked_token_id: number;

  @Column({ type: 'text', nullable: true })
  token: string;
}
