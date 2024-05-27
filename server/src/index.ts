import express,{Router} from "express";
import * as dbConnect from "./db/db-connect"
import * as dbquery from "./controller/db-query";

const router: Router = express.Router();
const app = express();
const port = 1338;
dbConnect.handleConnection();
app.use(express.json());
app.get("/", (req, res) => {
  res.send('Hello World!')
});
//routing section
app.use("/api/login", require("./controller/loginController"));
app.use("/api/schedule", require("./controller/scheduleController"));


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

// exit the pool when app is closed
process.on('SIGINT', () => {
  dbquery.pool.end(() => {
    console.log('Pool has ended');
    process.exit(0);
  });
});