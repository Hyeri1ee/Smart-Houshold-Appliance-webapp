import {DataSource} from 'typeorm';
import fs from 'fs/promises';
import {User} from "./entities/User";
import {RevokedToken} from "./entities/RevokedToken";
import {SolarSetup} from "./entities/SolarSetup";
import {Schedule} from "./entities/Schedule";
import {Time} from "./entities/Time";
import {Location} from "./entities/Location";

interface Settings {
  host: string;
  port: number;
  username: string;
  password: string;
  dbName: string;
  synchronize: boolean;
  logging: boolean;
}

let dataSource: DataSource | null = null;

const getSettings = async (): Promise<Settings> => {
  try {
    const data = await fs.readFile("config.json", "utf8");
    return JSON.parse(data) as Settings;
  } catch (err) {
    console.error("Error reading config file:", err);
    throw err;
  }
}

const generateDataSource = async (settings: Settings): Promise<DataSource> => {
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
      SolarSetup,
      Schedule,
      Time,
      RevokedToken,
    ],
    synchronize: settings.synchronize,
    logging: settings.logging,
  });
}

export const handleConnection = async (): Promise<void> => {
  try {
    console.log("Starting database connection...");
    const settings = await getSettings();
    dataSource = await generateDataSource(settings);
    await dataSource.initialize();
    console.log("Database connected.");
  } catch (e) {
    console.error(e);
  }
}
export const getDataSource = async (): Promise<DataSource> => {
  if (!dataSource) {
    try {
      console.log("Starting database connection...");
      const settings = await getSettings();
      dataSource = await generateDataSource(settings);
      await dataSource.initialize();
      console.log("Database connected.");
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
  return dataSource;
}