import {Entity, PrimaryColumn} from "typeorm";

@Entity()
export class Revoked_token {
  @PrimaryColumn()
  token: string;
}