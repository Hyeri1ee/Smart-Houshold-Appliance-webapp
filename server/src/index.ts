import express from "express";
import * as dbConnect from "./db/db-connect"
import {solarRoute} from "./routers/solar-route"
import {loginRoute} from "./routers/login-route"

const app = express();
const port = 1337;

dbConnect.handleConnection();

app.use(express.json());

app.use("/api/login", loginRoute);
app.use("/api/solar", solarRoute);

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
});