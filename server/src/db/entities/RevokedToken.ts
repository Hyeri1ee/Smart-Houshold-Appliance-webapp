import {Entity, PrimaryColumn} from "typeorm";

@Entity()
export class RevokedToken {
  @PrimaryColumn()
  token: string;
}