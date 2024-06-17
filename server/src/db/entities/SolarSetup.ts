import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class SolarSetup {
  @PrimaryColumn()
  solar_setup_id: number;

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
}