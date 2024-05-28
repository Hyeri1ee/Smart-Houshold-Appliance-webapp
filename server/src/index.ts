import express from "express";
import * as dbConnect from "./db/db-connect"
import { solarRoute } from "./routers/solar-route"

const app = express();
const port = 1337;

if (dbConnect.handleConnection() === undefined) {
  throw new Error("DataSource is undefined.");
}

app.use("/api/solar", solarRoute);

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
});