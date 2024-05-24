import express from "express";
import * as dbConnect from "./db/db-connect"

const app = express();
const port = 1337;

dbConnect.handleConnection();

app.get("/", (req, res) => {
  res.send('Hello World!')
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});