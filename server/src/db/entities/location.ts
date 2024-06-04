import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Solar_setup} from "./solar_setup";

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  location_id: number;

  @Column({ type: 'float', nullable: true })
  longitude: number;

  @Column({ type: 'float', nullable: true })
  latitude: number;

  @OneToOne(() => Solar_setup)
  @JoinColumn()
  solar_setup: Solar_setup
}