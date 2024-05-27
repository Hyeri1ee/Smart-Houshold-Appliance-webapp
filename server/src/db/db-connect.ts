import { DataSource } from 'typeorm';
import fs from 'fs/promises';
import { User } from "./entities/user";
import { Revoked_token } from "./entities/revoked_token";
import { Solar_setup } from "./entities/solar_setup";
import { Schedule } from "./entities/schedule";
import { Time } from "./entities/time";
import { Location } from "./entities/location";

interface Settings {
  host: string;
  port: number;
  username: string;
  password: string;
  dbName: string;
  synchronize: boolean;
  logging: boolean;
}

const getSettings = async (): Promise<Settings> => {
  try {
    const data = await fs.readFile("config.json", "utf8");
    return JSON.parse(data) as Settings;
  } catch (err) {
    console.error("Error reading config file:", err);
    throw err;
  }
}

const getDataSource = async (settings: Settings): Promise<DataSource> => {
  return new DataSource({
    type: "postgres",
    host: settings.host,
    port: settings.port,
    username: settings.username,
    password: settings.password,
    database: settings.dbName,
    entities: [
      User,
      Location,
      Solar_setup,
      Schedule,
      Time,
      Revoked_token,
    ],
    synchronize: settings.synchronize,
    logging: settings.logging,
  });
}

export const handleConnection = async (): Promise<DataSource | undefined> => {
  try {
    console.log("Starting db connection");
    const settings = await getSettings();
    const dataSource = await getDataSource(settings);
    await dataSource.initialize();
    console.log("db source done");
    return dataSource;
  } catch (e) {
    console.error(e);
  }
}