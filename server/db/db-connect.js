import {DataSource} from 'typeorm';
import fs from 'fs/promises';

const getSettings = async () => {
  try {
    const data = await fs.readFile("config.json", "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading config file:", err);
    throw err;
  }
}

const getDataSource = async (settings) => {
  return new DataSource({
    type: settings.type,
    host: settings.host,
    port: settings.port,
    username: settings.username,
    password: settings.password,
    database: settings.dbName,
    entities: [
      // "db/entities/*js"
    ],
    synchronize: settings.synchronize,
    logging: settings.logging,
  })
}

export const handleConnection = async () => {
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