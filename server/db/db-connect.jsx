import { createConnection } from 'typeorm';
import fs from "fs";

const getSettings = () => {
  try {
    fs.readFile("../config.json", "utf8", (err, data) => {
      if (err) {
        throw err;
      }

      return JSON.parse(data);
    });
  } catch (err) {
    console.error(err);
  }
}

const connect = async (settings) => {
  const connection = await createConnection({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: `${settings.dbUsername}`,
    password: `${settings.dbPassword}`,
    database: `${settings.dbName}`,
    entities: [],
    synchronize: true,
  });
  console.log('Connected to database');
}
try {
  connect(getSettings());
} catch (e) {
  console.error(e);
}