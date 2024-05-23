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
    username: settings.dbUsername,
    password: settings.dbPassword,
    database: settings.dbName,
    entities: [],
    synchronize: true,
  })
}

export const handleConnection = async () => {
  try {
    const settings = await getSettings();
    return await getDataSource(settings);
  } catch (e) {
    console.error(e);
  }
}